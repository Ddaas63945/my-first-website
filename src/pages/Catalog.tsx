import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Box,
  Grid2X2,
  Search,
  SlidersHorizontal,
  X,
  Heart,
} from "lucide-react";
import { products } from "../data/products";
import type { Category } from "../data/products";
import { ProductCard } from "../components/ui/ProductCard";
import { useShop } from "../store/shop";
import { navigate } from "../hooks/useRoute";
export default function Catalog() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [sort, setSort] = useState("curated");
  const [filters, setFilters] = useState(false);
  const favoriteOnly = useShop((s) => s.favoriteOnly);
  const setFavoriteOnly = useShop((s) => s.setFavoriteOnly);
  const favorites = useShop((s) => s.favorites);
  const list = useMemo(() => {
    const a = products.filter(
      (p) =>
        (p.name + " " + p.brand)
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()) &&
        (brand === "all" || p.brand === brand) &&
        (category === "all" || p.category === category) &&
        (!favoriteOnly || favorites.includes(p.id)),
    );
    return a.sort((a, b) =>
      sort === "price-up"
        ? a.price - b.price
        : sort === "price-down"
          ? b.price - a.price
          : sort === "name"
            ? a.name.localeCompare(b.name)
            : Number(b.imageColumn !== undefined) -
              Number(a.imageColumn !== undefined),
    );
  }, [query, brand, category, sort, favoriteOnly, favorites]);
  const reset = () => {
    setQuery("");
    setBrand("all");
    setCategory("all");
    setSort("curated");
    setFavoriteOnly(false);
  };
  return (
    <main className="page catalog-page">
      <div className="page-heading">
        <span className="eyebrow">
          <span className="status-dot" /> ИЗБРАННАЯ ПАРФЮМЕРИЯ
        </span>
        <div className="page-title-row">
          <h1>
            Найдите свой <em>характер.</em>
          </h1>
          <p>
            Одиннадцать историй.
            <br />
            Одна из них — ваша.
          </p>
        </div>
      </div>
      <div className="catalog-controls">
        <label className="search-field">
          <Search size={17} />
          <input
            type="search"
            placeholder="Название аромата или бренд"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Поиск аромата"
          />
          {query && (
            <button aria-label="Очистить поиск" onClick={() => setQuery("")}>
              <X size={14} />
            </button>
          )}
        </label>
        <button
          className={`filter-toggle ${filters ? "active" : ""}`}
          onClick={() => setFilters(!filters)}
        >
          <SlidersHorizontal size={16} /> Фильтры
        </button>
        <button
          className={`favorites-filter ${favoriteOnly ? "active" : ""}`}
          aria-pressed={favoriteOnly}
          onClick={() => setFavoriteOnly(!favoriteOnly)}
        >
          <Heart size={15} /> <span>Избранное</span>{" "}
          {favorites.length > 0 && <small>{favorites.length}</small>}
        </button>
        <div className="view-switch">
          <button
            className="active"
            aria-label="Каталог сеткой"
            aria-pressed="true"
          >
            <Grid2X2 size={16} />
          </button>
          <button
            onClick={() => navigate("home")}
            aria-label="Пространственный 3D-режим"
          >
            <Box size={17} />
            <span>3D</span>
          </button>
        </div>
      </div>
      <div className={`catalog-filter-row ${filters ? "expanded" : ""}`}>
        <div className="category-tabs">
          {(["all", "Мужской", "Женский", "Унисекс"] as const).map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c === "all"
                ? "Все ароматы"
                : c === "Мужской"
                  ? "Для него"
                  : c === "Женский"
                    ? "Для неё"
                    : c}
            </button>
          ))}
        </div>
        <div className="select-filters">
          <label>
            <span className="sr-only">Бренд</span>
            <select value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="all">Все бренды</option>
              {[...new Set(products.map((p) => p.brand))].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Сортировка</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="curated">Выбор NEXUS</option>
              <option value="price-up">Сначала дешевле</option>
              <option value="price-down">Сначала дороже</option>
              <option value="name">По названию</option>
            </select>
          </label>
        </div>
      </div>
      <div className="results-label">
        <span>
          {list.length} / {products.length} ароматов
        </span>
        {(query || brand !== "all" || category !== "all" || favoriteOnly) && (
          <button onClick={reset}>
            Сбросить фильтры <X size={11} />
          </button>
        )}
        <span>Демонстрационные цены в ₽</span>
      </div>
      {list.length ? (
        <div className="product-grid">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} />
          <h2>Пока ничего не найдено</h2>
          <p>Попробуйте другой запрос или откройте всю коллекцию.</p>
          <button className="button" onClick={reset}>
            Сбросить фильтры <ArrowUpRight size={16} />
          </button>
        </div>
      )}
      <p className="catalog-disclaimer">
        Коллекция представлена в демонстрационном режиме. Часть фотографий
        ожидает добавления и отмечена в карточках. Цены тестовые и не являются
        офертой.
      </p>
    </main>
  );
}
