export type Category = "Мужской" | "Женский" | "Унисекс";
export interface Product {
  id: string;
  brand: string;
  name: string;
  concentration: string;
  category: Category;
  character: string;
  description: string;
  notes: [string, string, string];
  volumes: number[];
  price: number;
  imageColumn?: number;
  accent: string;
}
export const products: Product[] = [
  {
    id: "sauvage",
    brand: "Dior",
    name: "Sauvage Elixir",
    concentration: "Elixir",
    category: "Мужской",
    character: "Пряный · Древесный · Насыщенный",
    description:
      "Концентрированная интерпретация свободы. Пряная свежесть встречается с лавандой и тёмной древесиной, оставляя глубокий, выразительный шлейф.",
    notes: [
      "Корица, мускатный орех, кардамон, грейпфрут",
      "Лаванда",
      "Солодка, сандал, амбра, пачули, ветивер",
    ],
    volumes: [60, 100],
    price: 18900,
    imageColumn: 0,
    accent: "#7e9dbf",
  },
  {
    id: "bleu",
    brand: "Chanel",
    name: "Bleu de Chanel",
    concentration: "Eau de Parfum",
    category: "Мужской",
    character: "Свежий · Древесный · Элегантный",
    description:
      "Свобода быть собой. Цитрусовая свежесть раскрывается в благородном древесном аккорде с тёплым, обволакивающим характером.",
    notes: [
      "Грейпфрут, лимон, мята, розовый перец",
      "Имбирь, мускатный орех, жасмин",
      "Ладан, сандал, кедр, амбра",
    ],
    volumes: [50, 100, 150],
    price: 14900,
    imageColumn: 1,
    accent: "#8faac1",
  },
  {
    id: "tobacco",
    brand: "Tom Ford",
    name: "Tobacco Vanille",
    concentration: "Eau de Parfum",
    category: "Унисекс",
    character: "Табак · Ваниль · Специи",
    description:
      "Атмосфера английского клуба в современной интерпретации. Пряный табачный лист, сливочная ваниль и сухофрукты создают насыщенную, тёплую композицию.",
    notes: [
      "Табачный лист, пряности",
      "Ваниль, какао, бобы тонка, цветок табака",
      "Сухофрукты, древесные ноты",
    ],
    volumes: [50, 100],
    price: 27900,
    accent: "#a48a6b",
  },
  {
    id: "aventus",
    brand: "Creed",
    name: "Aventus",
    concentration: "Eau de Parfum",
    category: "Мужской",
    character: "Фруктовый · Дымный · Древесный",
    description:
      "Характер, который остаётся в памяти. Сочная фруктовая увертюра сменяется дымными древесными оттенками и мягким мускусным шлейфом.",
    notes: [
      "Ананас, бергамот, чёрная смородина, яблоко",
      "Берёза, пачули, жасмин",
      "Мускус, дубовый мох, амбра, ваниль",
    ],
    volumes: [50, 100],
    price: 28900,
    accent: "#98a99b",
  },
  {
    id: "baccarat",
    brand: "Maison Francis Kurkdjian",
    name: "Baccarat Rouge 540",
    concentration: "Eau de Parfum",
    category: "Унисекс",
    character: "Амбровый · Цветочный · Древесный",
    description:
      "Свет, превращённый в аромат. Воздушный жасмин и шафран встречаются с минеральной амброй и свежесрезанной кедровой древесиной.",
    notes: [
      "Шафран, жасмин",
      "Амбровый аккорд, amberwood",
      "Кедр, пихтовая смола",
    ],
    volumes: [35, 70, 200],
    price: 24900,
    imageColumn: 5,
    accent: "#b8877d",
  },
  {
    id: "libre",
    brand: "Yves Saint Laurent",
    name: "Libre",
    concentration: "Eau de Parfum",
    category: "Женский",
    character: "Лаванда · Апельсиновый цвет · Ваниль",
    description:
      "Аромат внутренней свободы. Прохладная французская лаванда и чувственный апельсиновый цвет соединяются в смелой цветочной композиции.",
    notes: [
      "Лаванда, мандарин, чёрная смородина",
      "Апельсиновый цвет, жасмин",
      "Ваниль, мускус, кедр",
    ],
    volumes: [30, 50, 90],
    price: 11900,
    accent: "#c6ac75",
  },
  {
    id: "le-male",
    brand: "Jean Paul Gaultier",
    name: "Le Male Elixir",
    concentration: "Parfum",
    category: "Мужской",
    character: "Медовый · Ванильный · Амбровый",
    description:
      "Золотое тепло на коже. Свежая лаванда постепенно уступает место сладкой ванили, табаку и густому медовому аккорду.",
    notes: ["Лаванда, мята", "Ваниль, бензоин", "Мёд, бобы тонка, табак"],
    volumes: [75, 125],
    price: 13900,
    accent: "#bbaa7b",
  },
  {
    id: "layton",
    brand: "Parfums de Marly",
    name: "Layton",
    concentration: "Eau de Parfum",
    category: "Мужской",
    character: "Яблоко · Ваниль · Пряная древесина",
    description:
      "Непринуждённая элегантность с пряным сердцем. Свежее яблоко и бергамот раскрываются в мягкой ванильно-древесной базе.",
    notes: [
      "Яблоко, лаванда, бергамот",
      "Герань, фиалка, жасмин",
      "Ваниль, кардамон, сандал, пачули",
    ],
    volumes: [75, 125],
    price: 21900,
    accent: "#788ea7",
  },
  {
    id: "black-opium",
    brand: "Yves Saint Laurent",
    name: "Black Opium",
    concentration: "Eau de Parfum",
    category: "Женский",
    character: "Кофе · Ваниль · Белые цветы",
    description:
      "Энергия ночного города. Чёрный кофе контрастирует с нежностью белых цветов и мягкой ванилью — для тех, кто живёт в собственном ритме.",
    notes: [
      "Груша, розовый перец, апельсиновый цвет",
      "Кофе, жасмин, горький миндаль",
      "Ваниль, пачули, кедр",
    ],
    volumes: [30, 50, 90],
    price: 10900,
    imageColumn: 2,
    accent: "#c39488",
  },
  {
    id: "good-girl",
    brand: "Carolina Herrera",
    name: "Good Girl",
    concentration: "Eau de Parfum",
    category: "Женский",
    character: "Тубероза · Бобы тонка · Какао",
    description:
      "Светлая и тёмная стороны одного характера. Белые цветы встречаются с обжаренными бобами тонка и бархатистым какао.",
    notes: [
      "Миндаль, кофе, бергамот, лимон",
      "Тубероза, жасмин самбак, апельсиновый цвет",
      "Бобы тонка, какао, ваниль, сандал",
    ],
    volumes: [30, 50, 80],
    price: 9900,
    imageColumn: 3,
    accent: "#8797c5",
  },
  {
    id: "my-way",
    brand: "Giorgio Armani",
    name: "My Way",
    concentration: "Eau de Parfum",
    category: "Женский",
    character: "Тубероза · Жасмин · Белый мускус",
    description:
      "Аромат открытий и встреч. Светлый букет белых цветов, сочный бергамот и мягкий мускус — приглашение выбрать собственный путь.",
    notes: [
      "Бергамот, апельсиновый цвет",
      "Тубероза, индийский жасмин",
      "Мадагаскарская ваниль, белый мускус, кедр",
    ],
    volumes: [30, 50, 90],
    price: 10900,
    imageColumn: 4,
    accent: "#c8a3a5",
  },
];
export const productById = (id: string) => products.find((p) => p.id === id);
export const priceFor = (p: Product, volume: number) =>
  Math.round((p.price * Math.pow(volume / p.volumes[0], 0.72)) / 100) * 100;
export const money = (n: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(n);
export const imageAtlas = `${import.meta.env.BASE_URL}perfumes/collection.png`;

export function atlasCrop(p: Product) {
  const columns = [
    { x: 0, width: 440 },
    { x: 440, width: 490 },
    { x: 930, width: 470 },
    { x: 1400, width: 374 },
  ];
  if ((p.imageColumn ?? 0) < 4) {
    const c = columns[p.imageColumn ?? 0];
    return { ...c, total: 1774, height: 887, src: imageAtlas };
  }
  return {
    x: p.imageColumn === 4 ? 0 : 768,
    width: 768,
    total: 1536,
    height: 1024,
    src: `${import.meta.env.BASE_URL}perfumes/collection-two.png`,
  };
}
