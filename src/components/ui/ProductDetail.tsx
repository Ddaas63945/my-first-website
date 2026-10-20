import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Heart,
  ShoppingBag,
  X,
} from "lucide-react";
import { productById, priceFor, money } from "../../data/products";
import { useShop } from "../../store/shop";
import { Modal } from "./Modal";
import { ProductVisual } from "./ProductVisual";
export function ProductDetail({
  id,
  spatial,
}: {
  id: string;
  spatial: boolean;
}) {
  const p = productById(id)!;
  const [added, setAdded] = useState(false);
  const [volume, setVolume] = useState(p.volumes[0]);
  const select = useShop((s) => s.select);
  const add = useShop((s) => s.add);
  const favorite = useShop((s) => s.favorite);
  const saved = useShop((s) => s.favorites.includes(id));
  return (
    <Modal
      onClose={() => select(null)}
      label={`${p.brand} ${p.name}`}
      className={`product-modal ${spatial ? "spatial-detail" : ""}`}
    >
      {!spatial && (
        <div className="detail-image">
          <ProductVisual product={p} reflection />
          <span className="detail-image-note">
            {p.imageColumn !== undefined
              ? "ФОТОГРАФИЯ · ПРОСТРАНСТВЕННАЯ ПРЕЗЕНТАЦИЯ"
              : "ФОТОГРАФИЯ ОЖИДАЕТСЯ"}
          </span>
        </div>
      )}
      <div className="detail-content">
        <div className="detail-top">
          <button className="back-button" onClick={() => select(null)}>
            <ArrowLeft size={15} /> К коллекции
          </button>
          <button
            className="icon-button"
            onClick={() => select(null)}
            aria-label="Закрыть описание"
          >
            <X size={19} />
          </button>
        </div>
        <span className="eyebrow">
          {p.brand} <span> / {p.category}</span>
        </span>
        <h2>{p.name}</h2>
        <p className="detail-concentration">{p.concentration}</p>
        <p className="detail-description">{p.description}</p>
        <div className="notes">
          {["Верхние ноты", "Ноты сердца", "Базовые ноты"].map((label, i) => (
            <div key={label}>
              <span>{label}</span>
              <p>{p.notes[i]}</p>
            </div>
          ))}
        </div>
        <label className="field-label">Ваш объём</label>
        <div className="volume-options">
          {p.volumes.map((v) => (
            <button
              key={v}
              onClick={() => {
                setVolume(v);
                setAdded(false);
              }}
              className={volume === v ? "active" : ""}
              aria-pressed={volume === v}
            >
              {v} мл
            </button>
          ))}
        </div>
        <div className="detail-price">
          <strong>{money(priceFor(p, volume))}</strong>
          <span>Демонстрационная цена</span>
        </div>
        <div className="purchase-buttons">
          <button
            className="button light"
            onClick={() => {
              add(p.id, volume);
              setAdded(true);
            }}
          >
            {added ? <Check size={17} /> : <ShoppingBag size={17} />}{" "}
            {added ? "Добавлено в корзину" : "В корзину"}{" "}
            <ArrowUpRight size={17} />
          </button>
          <button
            className={`button square ${saved ? "is-favorite" : ""}`}
            onClick={() => favorite(id)}
            aria-label={saved ? "Убрать из избранного" : "В избранное"}
            aria-pressed={saved}
          >
            <Heart size={19} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <p className="fine-print">
          Демонстрационный магазин. Оплата и отправка заказов не производятся.
        </p>
      </div>
    </Modal>
  );
}
