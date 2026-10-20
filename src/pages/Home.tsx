import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  ChevronRight,
  Mouse,
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { products } from "../data/products";
import { useShop } from "../store/shop";
import { useReducedMotion } from "../hooks/useMotion";
import { ProductCard } from "../components/ui/ProductCard";
import { navigate } from "../hooks/useRoute";
const Showroom = lazy(() => import("../components/3d/Showroom"));
const featuredIds = [
  "sauvage",
  "bleu",
  "black-opium",
  "good-girl",
  "my-way",
  "baccarat",
];
export default function Home() {
  const selected = useShop((s) => s.selected);
  const select = useShop((s) => s.select);
  const [active, setActive] = useState("sauvage");
  const [intro, setIntro] = useState(
    () => !sessionStorage.getItem("nexus-intro-seen"),
  );
  const reduced = useReducedMotion();
  const introRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const current = products.find((p) => p.id === active)!;
  const index = products.indexOf(current);
  const finishIntro = () => {
    sessionStorage.setItem("nexus-intro-seen", "1");
    setIntro(false);
  };
  useEffect(() => {
    if (!intro) return;
    if (reduced) {
      sessionStorage.setItem("nexus-intro-seen", "1");
      setIntro(false);
      return;
    }
    const timeout = window.setTimeout(() => {
      if (introRef.current)
        gsap.to(introRef.current, {
          opacity: 0,
          duration: 0.6,
          onComplete: finishIntro,
        });
    }, 2900);
    return () => clearTimeout(timeout);
  }, [intro, reduced]);
  useEffect(() => {
    if (!heroRef.current || intro) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-copy > *",
        { y: reduced ? 0 : 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 1,
          stagger: 0.12,
          ease: "power2.out",
        },
      );
    }, heroRef);
    return () => ctx.revert();
  }, [intro, reduced]);
  const choose = (id: string) => {
    setActive(id);
    select(id);
  };
  const step = (dir: number) =>
    setActive(
      (old) =>
        products[
          (products.findIndex((p) => p.id === old) + dir + products.length) %
            products.length
        ].id,
    );
  return (
    <main>
      <section ref={heroRef} className={`hero ${selected ? "is-focused" : ""}`}>
        <Suspense
          fallback={
            <div className="scene-loading">
              <span /> Подготавливаем пространство
            </div>
          }
        >
          <Showroom
            activeId={selected || active}
            focused={!!selected}
            onChoose={choose}
            onStep={step}
          />
        </Suspense>
        <div className="hero-shade" />
        {intro && (
          <div className="intro" ref={introRef}>
            <div className="intro-mark">
              <span className="nexus-mark large">N</span>
              <span>
                NEXUS <small>PARFUM</small>
              </span>
              <p>НОВОЕ ИЗМЕРЕНИЕ АРОМАТА</p>
            </div>
            <button className="text-button" onClick={finishIntro}>
              Пропустить интро <ChevronRight size={14} />
            </button>
          </div>
        )}
        <div className="hero-topline">
          <span className="eyebrow">
            <span className="status-dot" /> SPATIAL PERFUMERY — EST. 2026
          </span>
          <span className="experience-tag">
            <Box size={13} /> ИНТЕРАКТИВНАЯ КОЛЛЕКЦИЯ
          </span>
        </div>
        <div className="hero-copy">
          <span className="hero-kicker">
            <span className="mini-line" /> ИСКУССТВО АРОМАТА В НОВОМ ИЗМЕРЕНИИ
          </span>
          <h1>
            Больше, <br />
            чем <em>аромат.</em>
          </h1>
          <p>
            Новая перспектива на парфюмерию.
            <br />
            Откройте коллекцию, которая раскрывает
            <br className="desktop-break" /> вашу индивидуальность.
          </p>
          <div className="hero-ctas">
            <button
              className="button light magnetic"
              onClick={() => navigate("catalog")}
            >
              Открыть коллекцию <ArrowUpRight size={18} />
            </button>
            <button
              className="hero-explore"
              onClick={() => choose(active)}
              aria-label={`Познакомиться с ${current.name}`}
            >
              <span className="circle-play">
                <MoveUpRight size={16} />
              </span>{" "}
              Исследовать в 3D
            </button>
          </div>
          <div className="hero-proof">
            <span>
              <Check size={11} /> ЗНАКОВЫЕ КОМПОЗИЦИИ
            </span>
            <i />
            <span>11 АРОМАТОВ · ОДНО ПРОСТРАНСТВО</span>
          </div>
        </div>
        <div className="hero-side-note">
          <span>COLLECTION / 001</span>
          <div />
          <span>SCROLL TO DISCOVER</span>
        </div>
        <div className="bottle-callout">
          <span className="callout-dot" />
          <span className="callout-line" />
          <button onClick={() => choose(active)}>
            <small>{current.brand.toUpperCase()}</small>
            <strong>
              {current.name} <ArrowUpRight size={14} />
            </strong>
            <span>{current.concentration}</span>
          </button>
        </div>
        <div className="hero-bottom">
          <button
            className="scroll-cue"
            onClick={() =>
              document
                .getElementById("selection")
                ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" })
            }
          >
            <span className="mouse-icon">
              <Mouse size={18} />
            </span>
            <span>ЛИСТАЙТЕ. ОТКРЫВАЙТЕ. ЧУВСТВУЙТЕ.</span>
            <ArrowDown size={13} />
          </button>
          <div className="scene-controls">
            <span className="scene-control-label">
              <span className="status-dot" /> В ПРОСТРАНСТВЕ
            </span>
            <button onClick={() => step(-1)} aria-label="Предыдущий аромат">
              <ArrowLeft size={17} />
            </button>
            <span className="scene-index">
              {String(index + 1).padStart(2, "0")}{" "}
              <i>/ {String(products.length).padStart(2, "0")}</i>
            </span>
            <button onClick={() => step(1)} aria-label="Следующий аромат">
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
      <div className="brand-strip" aria-label="Бренды коллекции">
        <span>DIOR</span>
        <span>CHANEL</span>
        <span className="brand-serif">TOM FORD</span>
        <span className="brand-serif">CREED</span>
        <span className="brand-mfk">
          Maison Francis Kurkdjian <small>PARIS</small>
        </span>
        <span>SAINT LAURENT</span>
        <span className="brand-serif">GIORGIO ARMANI</span>
      </div>
      <section className="selection section-wrap" id="selection">
        <div className="section-title-row">
          <div>
            <span className="eyebrow">01 / ВЫБОР NEXUS</span>
            <h2>
              Исключительные.
              <br />
              <em>Как и вы.</em>
            </h2>
          </div>
          <div className="section-title-side">
            <p>
              Композиции с характером.
              <br />
              Для моментов, которые остаются.
            </p>
            <button className="text-link" onClick={() => navigate("catalog")}>
              Вся коллекция <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        <div className="product-grid featured-grid">
          {featuredIds.slice(0, 4).map((id, i) => (
            <ProductCard
              key={id}
              product={products.find((p) => p.id === id)!}
              index={i}
            />
          ))}
        </div>
        <div className="collection-bottom">
          <span>ВЫБРАНЫ ЗА ХАРАКТЕР. СОЗДАНЫ ДЛЯ ВПЕЧАТЛЕНИЯ.</span>
          <button className="text-link" onClick={() => navigate("catalog")}>
            Ещё 7 ароматов <ArrowRight size={15} />
          </button>
        </div>
      </section>
      <section className="manifesto section-wrap">
        <div className="manifesto-orbit" aria-hidden="true">
          <div />
          <div />
          <div />
          <span className="nexus-mark">N</span>
        </div>
        <div className="manifesto-copy">
          <span className="eyebrow">02 / ФИЛОСОФИЯ NEXUS</span>
          <h2>
            Не просто выбрать.
            <br />
            <em>Почувствовать.</em>
          </h2>
          <p>
            Мы верим, что знакомство с ароматом начинается с ощущения. Поэтому
            создали пространство, в котором нет ничего лишнего. Только вы, свет
            и характер каждой композиции.
          </p>
          <button className="text-link" onClick={() => navigate("about")}>
            Открыть NEXUS <ArrowUpRight size={17} />
          </button>
        </div>
        <span className="manifesto-coordinate">
          55°45′ N · 37°37′ E<br />
          BEYOND THE ORDINARY
        </span>
      </section>
      <section className="experience-strip section-wrap">
        <div>
          <Box strokeWidth={1} size={25} />
          <span>
            Новая перспектива
            <small>Пространственная презентация ароматов</small>
          </span>
        </div>
        <div>
          <Sparkles strokeWidth={1} size={25} />
          <span>
            Продуманный выбор
            <small>Ноты, характер и детали каждой композиции</small>
          </span>
        </div>
        <div>
          <HeartIcon />
          <span>
            Ваша коллекция<small>Сохраняйте то, что вам близко</small>
          </span>
        </div>
      </section>
    </main>
  );
}
function HeartIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}
