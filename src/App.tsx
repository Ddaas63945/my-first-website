import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
  Check,
} from "lucide-react";
import { useShop } from "./store/shop";
import { useRoute, navigate } from "./hooks/useRoute";
import { useReducedMotion } from "./hooks/useMotion";
import { ProductDetail } from "./components/ui/ProductDetail";
import { Cart } from "./components/ui/Cart";
import Home from "./pages/Home";
const Catalog = lazy(() => import("./pages/Catalog"));
const Account = lazy(() => import("./pages/Account"));
const Checkout = lazy(() => import("./pages/Checkout"));
const About = lazy(() => import("./pages/About"));
export default function App() {
  const route = useRoute();
  const [menu, setMenu] = useState(false);
  const selected = useShop((s) => s.selected);
  const select = useShop((s) => s.select);
  const cartOpen = useShop((s) => s.cartOpen);
  const toggleCart = useShop((s) => s.toggleCart);
  const count = useShop((s) => s.cart.reduce((n, i) => n + i.quantity, 0));
  const toast = useShop((s) => s.toast);
  const notify = useShop((s) => s.notify);
  const setFavoriteOnly = useShop((s) => s.setFavoriteOnly);
  const reduced = useReducedMotion();
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMenu(false);
    select(null);
  }, [route, select]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => notify(""), 3500);
    return () => clearTimeout(timer);
  }, [toast, notify]);
  useEffect(() => {
    if (reduced) return;
    const handle = (e: PointerEvent) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>(".magnetic");
      document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
        if (el !== b) el.style.translate = "0px 0px";
      });
      if (b) {
        const r = b.getBoundingClientRect();
        b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.06}px ${(e.clientY - r.top - r.height / 2) * 0.08}px`;
      }
    };
    document.addEventListener("pointermove", handle);
    return () => document.removeEventListener("pointermove", handle);
  }, [reduced]);
  const go = (r: "home" | "catalog" | "account" | "about") => {
    setMenu(false);
    navigate(r);
  };
  return (
    <div ref={mainRef} className={reduced ? "app reduced-motion" : "app"}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Перейти к содержимому
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#"
          onClick={() => go("home")}
          aria-label="NEXUS PARFUM — главная"
        >
          <span className="nexus-mark">N</span>
          <span>
            NEXUS <small>PARFUM</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          <a href="#" className={route === "home" ? "active" : ""}>
            Пространство <span className="nav-dot" />
          </a>
          <a href="#catalog" className={route === "catalog" ? "active" : ""}>
            Коллекция
          </a>
          <a href="#about" className={route === "about" ? "active" : ""}>
            О NEXUS
          </a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button search-nav"
            aria-label="Поиск в каталоге"
            onClick={() => {
              setFavoriteOnly(false);
              go("catalog");
              window.setTimeout(
                () =>
                  document
                    .querySelector<HTMLInputElement>(".search-field input")
                    ?.focus(),
                350,
              );
            }}
          >
            <Search size={18} />
          </button>
          <button
            className="icon-button favorite-nav"
            aria-label="Избранные ароматы"
            onClick={() => {
              setFavoriteOnly(true);
              go("catalog");
            }}
          >
            <Heart size={18} />
          </button>
          <button
            className="icon-button account-nav-button"
            aria-label="Личный кабинет"
            onClick={() => go("account")}
          >
            <UserRound size={18} />
          </button>
          <span className="header-divider" />
          <button
            className="bag-button magnetic"
            aria-label={`Открыть корзину: ${count} товаров`}
            onClick={() => toggleCart(true)}
          >
            <ShoppingBag size={17} />
            <span className="bag-label">Корзина</span>
            <span className="cart-count" key={count}>
              {count}
            </span>
          </button>
          <button
            className="icon-button mobile-menu-button"
            aria-expanded={menu}
            aria-label={menu ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      {menu && (
        <nav className="mobile-menu" aria-label="Мобильная навигация">
          <a href="#" onClick={() => go("home")}>
            Пространство <ArrowUpRight />
          </a>
          <a href="#catalog" onClick={() => go("catalog")}>
            Коллекция <ArrowUpRight />
          </a>
          <a href="#about" onClick={() => go("about")}>
            О NEXUS <ArrowUpRight />
          </a>
          <a href="#account" onClick={() => go("account")}>
            Личный кабинет <UserRound size={20} />
          </a>
          <button
            onClick={() => {
              setFavoriteOnly(true);
              go("catalog");
            }}
          >
            Избранное <Heart size={20} />
          </button>
          <small>ИСКУССТВО АРОМАТА В НОВОМ ИЗМЕРЕНИИ</small>
        </nav>
      )}
      <div id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <main className="page loading-page">Открываем пространство…</main>
          }
        >
          {route === "home" ? (
            <Home />
          ) : route === "catalog" ? (
            <Catalog />
          ) : route === "account" ? (
            <Account />
          ) : route === "checkout" ? (
            <Checkout />
          ) : (
            <About />
          )}
        </Suspense>
      </div>
      <footer className="site-footer section-wrap">
        <div className="footer-top">
          <a className="brand" href="#">
            <span className="nexus-mark">N</span>
            <span>
              NEXUS <small>PARFUM</small>
            </span>
          </a>
          <p>
            Искусство аромата
            <br />в новом измерении.
          </p>
          <div>
            <a href="#catalog">
              Коллекция <ArrowUpRight size={12} />
            </a>
            <a href="#about">
              О проекте <ArrowUpRight size={12} />
            </a>
            <a href="#account">
              Личное пространство <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NEXUS PARFUM</span>
          <span>Демонстрационный магазин · без реальных покупок</span>
          <a href="#about">Данные и условия</a>
          <span>DESIGNED TO FEEL.</span>
        </div>
      </footer>
      {selected && (
        <ProductDetail
          key={selected}
          id={selected}
          spatial={route === "home"}
        />
      )}
      {cartOpen && <Cart />}
      <div
        className={`toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        <span>
          <Check size={15} />
        </span>
        {toast}
      </div>
    </div>
  );
}
