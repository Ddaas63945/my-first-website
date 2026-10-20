import { beforeEach, describe, expect, it, vi } from "vitest";
const storage = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => storage.get(k) ?? null,
  setItem: (k: string, v: string) => storage.set(k, v),
  removeItem: (k: string) => storage.delete(k),
});
const { useShop, cartTotal, cleanCart } = await import("./shop");
const { productById, priceFor } = await import("../data/products");
const { validateCustomer } = await import("../utils/validation");
beforeEach(() => {
  useShop.getState().clear();
  storage.clear();
});
describe("Корзина и демозаказ", () => {
  it("сохраняет объёмы отдельно, объединяет при смене объёма и пересчитывает сумму", () => {
    useShop.getState().add("sauvage", 60);
    useShop.getState().add("sauvage", 100);
    expect(useShop.getState().cart).toHaveLength(2);
    expect(cartTotal(useShop.getState().cart)).toBe(
      18900 + priceFor(productById("sauvage")!, 100),
    );
    useShop.getState().changeVolume("sauvage", 60, 100);
    expect(useShop.getState().cart).toEqual([
      { id: "sauvage", volume: 100, quantity: 2 },
    ]);
    expect(cartTotal(useShop.getState().cart)).toBe(
      2 * priceFor(productById("sauvage")!, 100),
    );
  });
  it("отбрасывает неизвестные товары и объёмы, ограничивает количество и удаляет позицию", () => {
    expect(
      cleanCart([
        { id: "missing", volume: 30, quantity: 1 },
        { id: "sauvage", volume: 17, quantity: 1 },
        { id: "sauvage", volume: 60, quantity: -1 },
        { id: "sauvage", volume: 60, quantity: 300 },
      ]),
    ).toEqual([{ id: "sauvage", volume: 60, quantity: 99 }]);
    useShop.getState().add("sauvage", 17);
    expect(useShop.getState().cart).toHaveLength(0);
    useShop.getState().add("sauvage", 60);
    useShop.getState().quantity("sauvage", 60, 0);
    expect(useShop.getState().cart).toHaveLength(0);
  });
  it("создаёт локальный неизменяемый снимок демозаказа и очищает корзину", () => {
    const customer = {
      name: "Демо Гость",
      email: "demo@example.com",
      phone: "+7 999 1234567",
      address: "Тестовый город, улица, дом 10",
    };
    expect(useShop.getState().checkout(customer, "")).toBeNull();
    useShop.getState().add("good-girl", 30);
    const id = useShop.getState().checkout(customer, "Тест");
    expect(id).toMatch(/^NX-/);
    expect(useShop.getState().cart).toHaveLength(0);
    expect(useShop.getState().orders[0]).toMatchObject({
      id,
      total: 9900,
      comment: "Тест",
      items: [{ id: "good-girl", volume: 30, quantity: 1 }],
    });
    useShop.getState().add("good-girl", 30);
    useShop.getState().quantity("good-girl", 30, 3);
    expect(useShop.getState().orders[0].items[0].quantity).toBe(1);
    expect(
      JSON.parse(storage.get("nexus-parfum-v1")!).state.orders,
    ).toHaveLength(1);
  });
  it("валидирует контактные поля до сохранения демозаказа", () => {
    expect(
      Object.keys(
        validateCustomer({
          name: " ",
          email: "wrong@",
          phone: "123",
          address: "дом",
        }),
      ),
    ).toHaveLength(4);
    expect(
      validateCustomer({
        name: "Демо",
        email: "demo@example.com",
        phone: "+7 (999) 123-45-67",
        address: "Город, улица, дом 10",
      }),
    ).toEqual({});
  });
});
