import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { productById, priceFor } from "../data/products";
export interface CartItem {
  id: string;
  volume: number;
  quantity: number;
}
export interface Profile {
  name: string;
  email: string;
  phone: string;
  address: string;
}
export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  customer: Profile;
  comment: string;
}
interface Shop {
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  profile: Profile;
  reducedEffects: boolean;
  selected: string | null;
  cartOpen: boolean;
  toast: string;
  favoriteOnly: boolean;
  select: (id: string | null) => void;
  toggleCart: (open: boolean) => void;
  notify: (text: string) => void;
  add: (id: string, volume: number) => void;
  quantity: (id: string, volume: number, n: number) => void;
  changeVolume: (id: string, oldVolume: number, nextVolume: number) => void;
  favorite: (id: string) => void;
  setFavoriteOnly: (v: boolean) => void;
  saveProfile: (p: Profile) => void;
  setReducedEffects: (v: boolean) => void;
  checkout: (p: Profile, comment: string) => string | null;
  clear: () => void;
}
const blankProfile: Profile = { name: "", email: "", phone: "", address: "" };
export function cleanCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const clean: CartItem[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const p = productById(raw.id);
    if (
      !p ||
      !p.volumes.includes(raw.volume) ||
      !Number.isInteger(raw.quantity) ||
      raw.quantity < 1
    )
      continue;
    const existing = clean.find(
      (i) => i.id === raw.id && i.volume === raw.volume,
    );
    if (existing)
      existing.quantity = Math.min(99, existing.quantity + raw.quantity);
    else
      clean.push({
        id: p.id,
        volume: raw.volume,
        quantity: Math.min(99, raw.quantity),
      });
  }
  return clean;
}
export const cartTotal = (cart: CartItem[]) =>
  cart.reduce((sum, i) => {
    const p = productById(i.id);
    return sum + (p ? priceFor(p, i.volume) * i.quantity : 0);
  }, 0);
export const useShop = create<Shop>()(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],
      orders: [],
      profile: blankProfile,
      reducedEffects: false,
      selected: null,
      cartOpen: false,
      toast: "",
      favoriteOnly: false,
      select: (id) => set({ selected: id }),
      toggleCart: (open) => set({ cartOpen: open }),
      notify: (toast) => set({ toast }),
      add: (id, volume) => {
        const p = productById(id);
        if (!p || !p.volumes.includes(volume)) return;
        set((s) => {
          const found = s.cart.find((i) => i.id === id && i.volume === volume);
          return {
            cart: found
              ? s.cart.map((i) =>
                  i === found
                    ? { ...i, quantity: Math.min(99, i.quantity + 1) }
                    : i,
                )
              : [...s.cart, { id, volume, quantity: 1 }],
            toast: `${p.name} — в вашей корзине`,
          };
        });
      },
      quantity: (id, volume, n) => {
        if (!Number.isInteger(n)) return;
        set((s) => ({
          cart: s.cart
            .map((i) =>
              i.id === id && i.volume === volume
                ? { ...i, quantity: Math.max(0, Math.min(n, 99)) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        }));
      },
      changeVolume: (id, oldVolume, nextVolume) => {
        const p = productById(id);
        if (!p?.volumes.includes(nextVolume)) return;
        set((s) => ({
          cart: cleanCart(
            s.cart.map((i) =>
              i.id === id && i.volume === oldVolume
                ? { ...i, volume: nextVolume }
                : i,
            ),
          ),
        }));
      },
      favorite: (id) => {
        if (!productById(id)) return;
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((v) => v !== id)
            : [...s.favorites, id],
        }));
      },
      setFavoriteOnly: (favoriteOnly) => set({ favoriteOnly }),
      saveProfile: (profile) =>
        set({ profile, toast: "Данные сохранены в этом браузере" }),
      setReducedEffects: (reducedEffects) => set({ reducedEffects }),
      checkout: (customer, comment) => {
        const cart = cleanCart(get().cart);
        if (!cart.length) return null;
        const id = `NX-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const order: Order = {
          id,
          date: new Date().toISOString(),
          items: cart.map((i) => ({ ...i })),
          total: cartTotal(cart),
          customer: { ...customer },
          comment,
        };
        set((s) => ({
          orders: [order, ...s.orders].slice(0, 50),
          cart: [],
          profile: customer,
          cartOpen: false,
          toast: "Демозаказ сохранён. Оплата не производилась.",
        }));
        return id;
      },
      clear: () =>
        set({
          cart: [],
          favorites: [],
          orders: [],
          profile: blankProfile,
          toast: "Локальные данные удалены",
        }),
    }),
    {
      name: "nexus-parfum-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        cart: s.cart,
        favorites: s.favorites,
        orders: s.orders,
        profile: s.profile,
        reducedEffects: s.reducedEffects,
      }),
      merge: (persisted, current) => {
        const p = (persisted || {}) as Partial<Shop>;
        const profile =
          p.profile && typeof p.profile === "object"
            ? (Object.fromEntries(
                Object.keys(blankProfile).map((k) => [
                  k,
                  typeof p.profile?.[k as keyof Profile] === "string"
                    ? p.profile[k as keyof Profile]
                    : "",
                ]),
              ) as unknown as Profile)
            : blankProfile;
        return {
          ...current,
          cart: cleanCart(p.cart),
          favorites: Array.isArray(p.favorites)
            ? p.favorites.filter(
                (id) => typeof id === "string" && productById(id),
              )
            : [],
          profile,
          reducedEffects: p.reducedEffects === true,
          orders: Array.isArray(p.orders)
            ? p.orders
                .filter(
                  (o) =>
                    o &&
                    typeof o.id === "string" &&
                    Number.isFinite(o.total) &&
                    typeof o.date === "string" &&
                    Array.isArray(o.items) &&
                    o.items.every((i) => productById(i.id)),
                )
                .slice(0, 50)
            : [],
        };
      },
    },
  ),
);
