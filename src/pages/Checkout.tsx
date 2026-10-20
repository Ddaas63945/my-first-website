import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, LockKeyhole } from "lucide-react";
import { useShop, cartTotal } from "../store/shop";
import type { Profile } from "../store/shop";
import { money, productById, priceFor } from "../data/products";
import { ProductVisual } from "../components/ui/ProductVisual";
import { navigate } from "../hooks/useRoute";
import { validateCustomer } from "../utils/validation";
export default function Checkout() {
  const cart = useShop((s) => s.cart);
  const profile = useShop((s) => s.profile);
  const checkout = useShop((s) => s.checkout);
  const [form, setForm] = useState<Profile>(profile);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof Profile, string>>>(
    {},
  );
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  if (success)
    return (
      <main className="page checkout-success">
        <span className="success-icon">
          <Check size={30} />
        </span>
        <span className="eyebrow">ТОЛЬКО ДЕМОНСТРАЦИЯ</span>
        <h1>
          Начало новой <em>истории.</em>
        </h1>
        <p>
          Демозаказ <strong>{success}</strong> сохранён в этом браузере.
        </p>
        <p className="muted">
          Оплата не производилась. Заказ никуда не отправлен,
          <br />
          доставка не оформлена.
        </p>
        <button className="button light" onClick={() => navigate("account")}>
          Перейти в личный кабинет <ArrowUpRight size={16} />
        </button>
      </main>
    );
  if (!cart.length)
    return (
      <main className="page empty-state">
        <h1>Коллекция пока пуста</h1>
        <p>Добавьте аромат, чтобы попробовать оформление демозаказа.</p>
        <button className="button light" onClick={() => navigate("catalog")}>
          К ароматам <ArrowUpRight size={17} />
        </button>
      </main>
    );
  return (
    <main className="page checkout-page">
      <button className="back-button" onClick={() => navigate("catalog")}>
        <ArrowLeft size={15} /> В каталог
      </button>
      <div className="page-heading">
        <span className="eyebrow">ВАШ СЛЕДУЮЩИЙ АРОМАТ</span>
        <h1>
          Последний <em>штрих.</em>
        </h1>
      </div>
      <div className="checkout-grid">
        <form
          className="checkout-form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const error = validateCustomer(form);
            setErrors(error);
            setConsentError(!consent);
            if (Object.keys(error).length || !consent) return;
            const id = checkout(
              Object.fromEntries(
                Object.entries(form).map(([k, v]) => [k, v.trim()]),
              ) as unknown as Profile,
              comment.trim(),
            );
            if (id) setSuccess(id);
          }}
        >
          <div className="demo-notice">
            <LockKeyhole size={18} />
            <p>
              <strong>Демонстрационное оформление</strong>
              <span>
                Используйте вымышленные данные. Они сохраняются только в
                браузере. Оплаты и отправки нет.
              </span>
            </p>
          </div>
          <h2>Контактные данные</h2>
          <div className="form-grid">
            {(
              [
                {
                  key: "name",
                  label: "Имя",
                  placeholder: "Как к вам обращаться",
                  type: "text",
                },
                {
                  key: "phone",
                  label: "Телефон",
                  placeholder: "+7 999 000-00-00",
                  type: "tel",
                },
                {
                  key: "email",
                  label: "Email",
                  placeholder: "name@example.com",
                  type: "email",
                },
                {
                  key: "address",
                  label: "Адрес доставки",
                  placeholder: "Город, улица, дом, квартира",
                  type: "text",
                },
              ] as const
            ).map((f) => (
              <label
                key={f.key}
                className={`form-field ${f.key === "address" ? "full" : ""}`}
              >
                {f.label}
                <input
                  name={f.key}
                  type={f.type}
                  value={form[f.key]}
                  maxLength={f.key === "address" ? 250 : 120}
                  placeholder={f.placeholder}
                  autoComplete="off"
                  required
                  aria-invalid={!!errors[f.key]}
                  aria-describedby={
                    errors[f.key] ? `error-${f.key}` : undefined
                  }
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                />
                {errors[f.key] && (
                  <span
                    role="alert"
                    className="field-error"
                    id={`error-${f.key}`}
                  >
                    {errors[f.key]}
                  </span>
                )}
              </label>
            ))}
            <label className="form-field full">
              Комментарий <span className="muted">— необязательно</span>
              <textarea
                placeholder="Ваши пожелания"
                value={comment}
                maxLength={1000}
                onChange={(e) => setComment(e.target.value)}
              />
            </label>
          </div>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />{" "}
            Я понимаю, что это демозаказ без оплаты и доставки, и согласен
            сохранить введённые данные в этом браузере.
          </label>
          {consentError && (
            <p role="alert" className="field-error">
              Подтвердите демонстрационный режим
            </p>
          )}
          <button type="submit" className="button light">
            Сохранить демозаказ <ArrowUpRight size={17} />
          </button>
        </form>
        <aside className="checkout-summary">
          <span className="eyebrow">ВАШ ВЫБОР</span>
          <h2>Ваша коллекция</h2>
          {cart.map((i) => {
            const p = productById(i.id)!;
            return (
              <div key={`${i.id}:${i.volume}`} className="checkout-item">
                <ProductVisual product={p} />
                <div>
                  <span className="brand-label">{p.brand}</span>
                  <h3>{p.name}</h3>
                  <p>
                    {i.volume} мл <span>× {i.quantity}</span>
                  </p>
                </div>
                <strong>{money(priceFor(p, i.volume) * i.quantity)}</strong>
              </div>
            );
          })}
          <div className="summary-line">
            <span>Доставка</span>
            <span>Не оформляется</span>
          </div>
          <div className="summary-total">
            <span>Итого</span>
            <strong>{money(cartTotal(cart))}</strong>
          </div>
          <p className="fine-print">
            Тестовые цены. Настоящая покупка не совершается.
          </p>
        </aside>
      </div>
    </main>
  );
}
