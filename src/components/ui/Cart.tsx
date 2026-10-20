import {
  ArrowUpRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useShop, cartTotal } from "../../store/shop";
import { productById, priceFor, money } from "../../data/products";
import { ProductVisual } from "./ProductVisual";
import { Modal } from "./Modal";
import { navigate } from "../../hooks/useRoute";
export function Cart() {
  const { cart, toggleCart, quantity, changeVolume } = useShop();
  return (
    <Modal
      onClose={() => toggleCart(false)}
      className="cart-modal"
      label="Ваша корзина"
    >
      <div className="drawer-header">
        <div>
          <span className="eyebrow">ВАША КОЛЛЕКЦИЯ</span>
          <h2>
            Корзина <sup>{cart.reduce((n, i) => n + i.quantity, 0)}</sup>
          </h2>
        </div>
        <button
          className="icon-button"
          onClick={() => toggleCart(false)}
          aria-label="Закрыть корзину"
        >
          <X />
        </button>
      </div>
      {cart.length ? (
        <>
          <div className="cart-items">
            {cart.map((i) => {
              const p = productById(i.id)!;
              return (
                <article className="cart-item" key={`${i.id}:${i.volume}`}>
                  <div className="cart-image">
                    <ProductVisual product={p} />
                  </div>
                  <div className="cart-item-content">
                    <span className="brand-label">{p.brand}</span>
                    <h3>{p.name}</h3>
                    <label
                      className="sr-only"
                      htmlFor={`volume-${p.id}-${i.volume}`}
                    >
                      Объём {p.name}
                    </label>
                    <select
                      id={`volume-${p.id}-${i.volume}`}
                      value={i.volume}
                      onChange={(e) =>
                        changeVolume(i.id, i.volume, Number(e.target.value))
                      }
                    >
                      {p.volumes.map((v) => (
                        <option key={v} value={v}>
                          {v} мл
                        </option>
                      ))}
                    </select>
                    <div className="cart-item-actions">
                      <div className="quantity">
                        <button
                          aria-label={`Уменьшить количество ${p.name}`}
                          onClick={() =>
                            quantity(i.id, i.volume, i.quantity - 1)
                          }
                        >
                          <Minus size={12} />
                        </button>
                        <span>{i.quantity}</span>
                        <button
                          disabled={i.quantity >= 99}
                          aria-label={`Увеличить количество ${p.name}`}
                          onClick={() =>
                            quantity(i.id, i.volume, i.quantity + 1)
                          }
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <strong>
                        {money(priceFor(p, i.volume) * i.quantity)}
                      </strong>
                      <button
                        className="icon-button"
                        aria-label={`Удалить ${p.name}`}
                        onClick={() => quantity(i.id, i.volume, 0)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="cart-summary">
            <p>
              Итого <strong>{money(cartTotal(cart))}</strong>
            </p>
            <span className="fine-print">
              Тестовые цены · без оплаты и отправки
            </span>
            <button
              className="button light"
              onClick={() => {
                toggleCart(false);
                useShop.getState().select(null);
                navigate("checkout");
              }}
            >
              Оформить демозаказ <ArrowUpRight size={18} />
            </button>
            <button className="text-button" onClick={() => toggleCart(false)}>
              Продолжить знакомство
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={35} strokeWidth={1} />
          <h3>Здесь начинается ваша коллекция</h3>
          <p>Найдите аромат, который станет частью вашей истории.</p>
          <button
            className="button light"
            onClick={() => {
              toggleCart(false);
              navigate("catalog");
            }}
          >
            Открыть каталог <ArrowUpRight size={17} />
          </button>
        </div>
      )}
    </Modal>
  );
}
