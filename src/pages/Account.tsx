import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Heart,
  MapPin,
  Package,
  Settings,
  UserRound,
} from "lucide-react";
import { useShop } from "../store/shop";
import { money, products, productById } from "../data/products";
import { ProductCard } from "../components/ui/ProductCard";
import { navigate } from "../hooks/useRoute";
const tabs = [
  { id: "profile", label: "Мой профиль", icon: UserRound },
  { id: "orders", label: "Мои заказы", icon: Package },
  { id: "favorites", label: "Избранные ароматы", icon: Heart },
  { id: "addresses", label: "Адрес доставки", icon: MapPin },
  { id: "settings", label: "Настройки", icon: Settings },
] as const;
type Tab = (typeof tabs)[number]["id"];
export default function Account() {
  const [tab, setTab] = useState<Tab>("profile");
  const {
    profile,
    saveProfile,
    orders,
    favorites,
    reducedEffects,
    setReducedEffects,
    clear,
  } = useShop();
  const [form, setForm] = useState(profile);
  const [confirmClear, setConfirmClear] = useState(false);
  return (
    <main className="page account-page">
      <div className="page-heading">
        <span className="eyebrow">ВАШЕ ЛИЧНОЕ ПРОСТРАНСТВО</span>
        <h1>
          Ближе к <em>себе.</em>
        </h1>
        <p className="muted">
          Демонстрационный кабинет · локальное хранение · без авторизации
        </p>
      </div>
      <div className="account-layout">
        <aside className="account-nav">
          <div className="account-avatar">
            <span>{profile.name.trim().slice(0, 1).toUpperCase() || "N"}</span>
            <div>
              <strong>{profile.name || "Гость NEXUS"}</strong>
              <small>Локальный профиль</small>
            </div>
          </div>
          <div role="tablist" aria-label="Разделы личного кабинета">
            {tabs.map((t) => (
              <button
                role="tab"
                aria-selected={tab === t.id}
                aria-controls="account-panel"
                id={`account-tab-${t.id}`}
                key={t.id}
                className={tab === t.id ? "active" : ""}
                onClick={() => setTab(t.id)}
              >
                <t.icon size={17} />
                {t.label}
                <span>
                  {t.id === "favorites"
                    ? favorites.length
                    : t.id === "orders"
                      ? orders.length
                      : ""}
                </span>
              </button>
            ))}
          </div>
          <p className="fine-print">
            Данные доступны только в этом браузере. Для проверки используйте
            вымышленные сведения.
          </p>
        </aside>
        <section
          className="account-content"
          id="account-panel"
          role="tabpanel"
          aria-labelledby={`account-tab-${tab}`}
        >
          {tab === "profile" && (
            <>
              <span className="eyebrow">01 / МОЙ ПРОФИЛЬ</span>
              <h2>Рады знакомству.</h2>
              <p className="muted">
                Пара деталей для вашего следующего демозаказа.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveProfile({
                    ...profile,
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                  });
                }}
              >
                <div className="form-grid">
                  {(
                    [
                      { key: "name", label: "Имя", type: "text" },
                      { key: "email", label: "Email", type: "email" },
                      { key: "phone", label: "Телефон", type: "tel" },
                    ] as const
                  ).map((f) => (
                    <label className="form-field" key={f.key}>
                      {f.label}
                      <input
                        type={f.type}
                        maxLength={120}
                        value={form[f.key]}
                        placeholder={
                          f.key === "name"
                            ? "Ваше имя"
                            : f.key === "email"
                              ? "name@example.com"
                              : "+7 999 000-00-00"
                        }
                        onChange={(e) =>
                          setForm({ ...form, [f.key]: e.target.value })
                        }
                      />
                    </label>
                  ))}
                </div>
                <button className="button light" type="submit">
                  Сохранить изменения <Check size={16} />
                </button>
              </form>
            </>
          )}
          {tab === "orders" && (
            <>
              <span className="eyebrow">02 / МОИ ЗАКАЗЫ</span>
              <h2>Истории вашей коллекции.</h2>
              {orders.length ? (
                orders.map((o) => (
                  <article className="order-card" key={o.id}>
                    <div className="order-heading">
                      <div>
                        <strong>{o.id}</strong>
                        <small>
                          {new Date(o.date).toLocaleDateString("ru-RU")}
                        </small>
                      </div>
                      <span className="demo-badge">ДЕМО · НЕ ОТПРАВЛЕН</span>
                    </div>
                    {o.items.map((i) => (
                      <p key={`${i.id}:${i.volume}`}>
                        {productById(i.id)?.name}{" "}
                        <span>
                          {i.volume} мл × {i.quantity}
                        </span>
                      </p>
                    ))}
                    <div className="order-total">
                      <span>Без оплаты и доставки</span>
                      <strong>{money(o.total)}</strong>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <Package size={30} strokeWidth={1} />
                  <h3>Новая история впереди</h3>
                  <p>Здесь появятся сохранённые демонстрационные заказы.</p>
                  <button
                    className="button"
                    onClick={() => navigate("catalog")}
                  >
                    Выбрать аромат <ArrowUpRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
          {tab === "favorites" && (
            <>
              <span className="eyebrow">03 / ИЗБРАННОЕ</span>
              <h2>То, что откликается.</h2>
              {favorites.length ? (
                <div className="product-grid account-products">
                  {products
                    .filter((p) => favorites.includes(p.id))
                    .map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Heart size={30} strokeWidth={1} />
                  <h3>Следуйте за ощущением</h3>
                  <p>Сохраняйте ароматы с помощью сердечка в каталоге.</p>
                  <button
                    className="button"
                    onClick={() => navigate("catalog")}
                  >
                    В коллекцию <ArrowUpRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
          {tab === "addresses" && (
            <>
              <span className="eyebrow">04 / АДРЕС ДОСТАВКИ</span>
              <h2>Ваша точка на карте.</h2>
              <p className="muted">
                Только для демонстрации. Реальная доставка не оформляется.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveProfile({ ...profile, address: form.address.trim() });
                }}
              >
                <label className="form-field">
                  Демонстрационный адрес
                  <textarea
                    value={form.address}
                    maxLength={250}
                    placeholder="Город, улица, дом, квартира"
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </label>
                <button className="button light" type="submit">
                  Сохранить адрес <Check size={16} />
                </button>
              </form>
            </>
          )}
          {tab === "settings" && (
            <>
              <span className="eyebrow">05 / НАСТРОЙКИ</span>
              <h2>В вашем ритме.</h2>
              <label className="setting-row">
                <div>
                  <strong>Уменьшить анимацию</strong>
                  <p>Спокойная презентация без покачивания и параллакса.</p>
                </div>
                <input
                  type="checkbox"
                  role="switch"
                  checked={reducedEffects}
                  onChange={(e) => setReducedEffects(e.target.checked)}
                />
              </label>
              <div className="setting-row">
                <div>
                  <strong>Локальные данные</strong>
                  <p>
                    Корзина, избранное, демозаказы и профиль сохраняются на
                    устройстве.
                  </p>
                </div>
              </div>
              <button
                className="button danger"
                onClick={() => {
                  if (confirmClear) {
                    clear();
                    setForm({ name: "", email: "", phone: "", address: "" });
                    setConfirmClear(false);
                  } else setConfirmClear(true);
                }}
              >
                {confirmClear
                  ? "Подтвердить удаление всех локальных данных"
                  : "Удалить мои данные"}
              </button>
              {confirmClear && (
                <button
                  className="text-button"
                  onClick={() => setConfirmClear(false)}
                >
                  Отмена
                </button>
              )}
              <p className="fine-print">
                Это демонстрационная система без защищённой авторизации. Не
                вводите конфиденциальную информацию.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
