import { ArrowUpRight, Heart, Plus } from "lucide-react";
import type { Product } from "../../data/products";
import { money } from "../../data/products";
import { useShop } from "../../store/shop";
import { ProductVisual } from "./ProductVisual";
export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const favorite = useShop((s) => s.favorites.includes(product.id));
  const toggle = useShop((s) => s.favorite);
  const select = useShop((s) => s.select);
  const add = useShop((s) => s.add);
  return (
    <article
      className="product-card"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="card-top">
        <span>{product.category}</span>
        <button
          className={`icon-button favorite ${favorite ? "is-favorite" : ""}`}
          aria-label={`${favorite ? "Убрать из избранного" : "В избранное"}: ${product.name}`}
          aria-pressed={favorite}
          onClick={() => toggle(product.id)}
        >
          <Heart size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <button
        className="card-image-button"
        onClick={() => select(product.id)}
        aria-label={`Подробнее: ${product.brand} ${product.name}`}
      >
        <ProductVisual product={product} />
        <span className="quick-view">
          Познакомиться <ArrowUpRight size={14} />
        </span>
      </button>
      <div className="card-description">
        <span className="brand-label">{product.brand}</span>
        <button className="card-title" onClick={() => select(product.id)}>
          {product.name}
        </button>
        <p>
          {product.concentration} <span>·</span> {product.volumes[0]} мл
        </p>
        <div className="card-bottom">
          <span>{money(product.price)}</span>
          <button
            className="add-small magnetic"
            onClick={() => add(product.id, product.volumes[0])}
            aria-label={`В корзину: ${product.name}`}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
