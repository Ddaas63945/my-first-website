import { useState } from "react";
import { atlasCrop } from "../../data/products";
import type { Product } from "../../data/products";
import { ArrowUpRight } from "lucide-react";
export function ProductVisual({
  product,
  reflection = false,
}: {
  product: Product;
  reflection?: boolean;
}) {
  const crop = atlasCrop(product);
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`product-visual ${reflection ? "with-reflection" : ""}`}
      aria-label={
        product.imageColumn !== undefined && !failed
          ? `${product.brand} ${product.name}, фотография флакона`
          : `${product.name}: фото пока недоступно`
      }
    >
      {product.imageColumn !== undefined && !failed ? (
        <>
          <div
            className="photo-crop"
            style={{ aspectRatio: `${crop.width}/${crop.height}` }}
          >
            <img
              src={crop.src}
              alt={`${product.brand} ${product.name}`}
              loading="lazy"
              onError={() => setFailed(true)}
              style={{
                width: `${(crop.total / crop.width) * 100}%`,
                left: `-${(crop.x / crop.width) * 100}%`,
              }}
            />
          </div>
          {reflection && (
            <div
              className="photo-crop reflection"
              style={{ aspectRatio: `${crop.width}/${crop.height}` }}
              aria-hidden="true"
            >
              <img
                src={crop.src}
                alt=""
                style={{
                  width: `${(crop.total / crop.width) * 100}%`,
                  left: `-${(crop.x / crop.width) * 100}%`,
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="image-placeholder">
          <span className="placeholder-line" />
          <span>{product.brand}</span>
          <strong>{product.name}</strong>
          <small>
            ФОТО ОЖИДАЕТСЯ <ArrowUpRight size={11} />
          </small>
          <span className="placeholder-line" />
        </div>
      )}
    </div>
  );
}
