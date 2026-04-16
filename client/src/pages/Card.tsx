import { useState, useRef, useCallback, useEffect } from "react";
import { Heart, User, ShoppingBag, LayoutGrid } from "lucide-react";

// ─── ASSETS & DATA ─────────────────────────────────────────────────────────────

const PRODUCT = {
  id: "DR04",
  name: "Лимфодренажный крем для лица",
  brand: "ANGIOGENIN",
  rating: 4.9,
  reviewCount: 5,
  inStock: true,
  badges: [
    { label: "ХИТ", color: "#ef8019" },
    { label: "DRAINAGE", color: "#2c3571" },
    { label: "УЧАСТВУЕТ В АКЦИИ", color: "#ef4319", hasIcon: true },
  ],
  variants: {
    7: {
      price: 790, oldPrice: null as null | number, bonusPoints: 8, installmentAmount: 198,
      thumbnails: [
        "/figmaAssets/656f201fc66d45dc5299392d12c724b6-1.png",
        "/figmaAssets/rectangle-81.png",
        "/figmaAssets/rectangle-82.png",
      ],
      shortDesc: "Миниатюра для путешествий. Активные компоненты стимулируют отток лимфы и обладают выраженным противоотёчным свойством.",
    },
    30: {
      price: 1990, oldPrice: null as null | number, bonusPoints: 20, installmentAmount: 498,
      thumbnails: [
        "/figmaAssets/rectangle-81.png",
        "/figmaAssets/656f201fc66d45dc5299392d12c724b6-1.png",
        "/figmaAssets/rectangle-82.png",
      ],
      shortDesc: "Активные компоненты, входящие в состав, стимулируют отток лимфы и обладают выраженным противоотёчным свойством.",
    },
    50: {
      price: 2570, oldPrice: 2890 as null | number, bonusPoints: 25, installmentAmount: 643,
      thumbnails: [
        "/figmaAssets/product-dr04-main.jpg",
        "/figmaAssets/product-1503.jpg",
        "/figmaAssets/656f201fc66d45dc5299392d12c724b6-1.png",
      ],
      shortDesc: "Активные компоненты стимулируют отток лимфы и обладают выраженным противоотёчным свойством. Крем увлажняет, оказывает липолитическое действие и обеспечивает лифтинг-эффект.",
    },
  } as Record<number, { price: number; oldPrice: null | number; bonusPoints: number; installmentAmount: number; thumbnails: string[]; shortDesc: string }>,
  specs: [
    { label: "PH", value: "5,5 – 6,5" },
    { label: "Назначение", value: "Против признаков старения, увлажнение" },
    { label: "Активные компоненты", value: "Рекомбинантный ангиогенин, Комплекс кофеина, коэнзима А и экстракта володушки (Lipocare™)" },
  ],
  tabs: {
    "Описание": [
      { title: "ЛИМФОДРЕНАЖНЫЙ КРЕМ ДЛЯ ЛИЦА", text: "Крем предназначен для активизации обменных процессов в клетках кожи и улучшения микроциркуляции. Активные компоненты, входящие в состав, стимулируют отток лимфы и обладают выраженным противоотёчным свойством. Крем увлажняет, оказывает липолитическое действие и обеспечивает лифтинг-эффект, снижает проницаемость сосудистой стенки и уменьшает накопление продуктов метаболизма гемоглобина для коррекции тёмных кругов." },
      { title: "Способ применения", text: "Нанести утром на очищенную кожу лица, шею и декольте. Можно использовать как основу под макияж." },
      { title: "Меры предосторожности", text: "Только для наружного применения. Не использовать при индивидуальной непереносимости компонентов." },
      { title: "Хранение", text: "Хранить при температуре от +5 °C до +25 °C." },
    ],
    "Протоколы применения": [
      { title: "БАЗОВЫЙ ПРОТОКОЛ", text: "Очистить кожу мягким средством. Нанести тоник. Распределить крем по массажным линиям лица, шеи, декольте утром ежедневно." },
      { title: "ИНТЕНСИВНЫЙ ПРОТОКОЛ", text: "Применять с ручным или аппаратным лимфодренажным массажем 2–3 раза в неделю." },
      { title: "КУРС", text: "Рекомендуемый курс — 4 недели ежедневно. Далее — поддерживающий режим 3–4 раза в неделю." },
    ],
    "Состав": [
      { title: "ПОЛНЫЙ СОСТАВ (INCI)", text: "Aqua, Glycerin, Cetearyl Alcohol, Recombinant Angiogenin, Lipocare™ (Caffeine, Coenzyme A, Bupleurum Falcatum Extract), Phenoxyethanol, Ethylhexylglycerin, Carbomer, Triethanolamine, Parfum." },
    ],
    "Активы": [
      { title: "РЕКОМБИНАНТНЫЙ АНГИОГЕНИН", text: "Биотехнологический белок, стимулирующий ангиогенез и улучшающий микроциркуляцию." },
      { title: "LIPOCARE™", text: "Запатентованный комплекс из кофеина, коэнзима А и экстракта володушки серповидной. Стимулирует липолиз, уменьшает отёчность и тёмные круги." },
    ],
    "Документы": [
      { title: "СЕРТИФИКАТ", text: "Соответствует ТР ТС 009/2011 «О безопасности парфюмерно-косметической продукции»." },
    ],
    "Доставка": [
      { title: "БЕСПЛАТНАЯ ДОСТАВКА", text: "При заказе от 5 000 ₽ по всей России." },
      { title: "СРОКИ", text: "Москва и МО: 1–2 дня. Регионы: 2–7 дней." },
    ],
  } as Record<string, { title: string; text: string }[]>,
};

const NAV_ITEMS = ["ПОДБОР УХОДА", "НОВИНКИ", "АНГИОГЕНИН", "ДОСТАВКА", "БОНУСНАЯ ПРОГРАММА", "ДЛЯ ПАРТНЕРОВ"];
const TABS = ["Описание", "Протоколы применения", "Состав", "Активы", "Документы", "Доставка"];
const QUICK_LINKS = [
  { icon: "/figmaAssets/outline---essentional--ui---box.png", label: "Рассчитать доставку" },
  { icon: "/figmaAssets/outline---messages--conversation---dialog.png", label: "Нужна консультация" },
  { icon: "/figmaAssets/outline---essentional--ui---bolt.png", label: "Товар участвует в акции" },
];
const RATING_BARS = [
  { star: 5, count: 4, pct: 82 }, { star: 4, count: 1, pct: 6 },
  { star: 3, count: 0, pct: 0 }, { star: 2, count: 0, pct: 0 }, { star: 1, count: 0, pct: 0 },
];
const REVIEWS = [
  { name: "Анастасия", date: "3 августа 2026", text: "Хорошо питает кожу, заметно уменьшилась отёчность уже после первой недели.", likes: 5, dislikes: 0, isCosmetologist: false },
  { name: "Мария", date: "3 августа 2026", text: "Рекомендую всем своим клиентам. Выраженный дренажный эффект, кожа становится упругой.", likes: 8, dislikes: 0, isCosmetologist: true },
  { name: "Екатерина", date: "15 июля 2026", text: "Отличный крем, лёгкая текстура, быстро впитывается.", likes: 5, dislikes: 0, isCosmetologist: false },
  { name: "Ольга", date: "10 июля 2026", text: "Использую второй месяц: кожа подтянулась, исчезли мешки под глазами.", likes: 3, dislikes: 0, isCosmetologist: false },
  { name: "Наталья", date: "2 июля 2026", text: "Пробовала много дренажных кремов — этот лучший. Видимый эффект.", likes: 6, dislikes: 0, isCosmetologist: false },
];
const NEW_PRODUCTS = [
  { image: "/figmaAssets/image-6.png", badge: "НОВИНКА", name: "Сыворотка с ниацинамидом, 30 мл", price: "2 500 ₽" },
  { image: "/figmaAssets/image-7.png", badge: "НОВИНКА", name: "Энзимная очищающая пудра, 40 г", price: "1 870 ₽" },
  { image: "/figmaAssets/-----------50------1--1.png", badge: "НОВИНКА", name: "Лимфодренажный крем для лица, 50 мл", price: "2 570 ₽" },
  { image: "/figmaAssets/-----------50------1--1-1.png", badge: "НОВИНКА", name: "Очищающий гель с аминокислотами шелка, 150 мл", price: "2 570 ₽" },
];
const BENEFITS = [
  "Пробники\nс каждой покупкой",
  "Бонусная\nпрограмма",
  "Бесплатная доставка\nот 5000р",
  "Рассрочка\nплатежа",
];
const FOOTER_COLS = [
  { title: "ИНТЕРНЕТ-МАГАЗИН", links: ["Каталог товаров", "Как сделать заказ", "Способ оплаты", "Доставка", "Каталог (онлайн)", "Catalog (online)"] },
  { title: "ЛИЧНЫЙ КАБИНЕТ", links: ["Личный кабинет", "История заказов", "Избранное", "Косметологам"] },
  { title: "ИНФОРМАЦИЯ", links: ["Производство", "Реквизиты компании", "Политика конфиденциальности", "Публичная оферта"] },
  { title: "ДОПОЛНИТЕЛЬНО", links: ["Обучение", "Связаться с нами", "Программа лояльности", "Правила и условия", "Программы домашнего ухода (pdf)"] },
];
const SOCIALS = [
  { icon: "/figmaAssets/vector-1.svg", label: "VK" },
  { icon: "/figmaAssets/max-messenger-sign-logo-1.svg", label: "MAX" },
  { icon: "/figmaAssets/vector.svg", label: "TELEGRAM" },
];

// Section refs for mobile tab scroll
const SECTION_IDS = {
  "Описание": "section-desc",
  "Протоколы применения": "section-protocols",
  "Состав": "section-composition",
  "Активы": "section-actives",
  "Документы": "section-docs",
  "Доставка": "section-delivery",
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export const Card = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("Описание");
  const [activeVol, setActiveVol] = useState(50);
  const [activeThumb, setActiveThumb] = useState(0);
  const [cartAdded, setCartAdded] = useState(false);
  const [oneDone, setOneDone] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const variant = PRODUCT.variants[activeVol];

  const switchVolume = (v: number) => {
    setActiveVol(v);
    setActiveThumb(0);
    galleryRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  const scrollToThumb = (idx: number) => {
    setActiveThumb(idx);
    if (galleryRef.current) {
      const el = galleryRef.current;
      const slide = el.children[idx] as HTMLElement;
      if (slide) el.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }
  };

  const onGalleryScroll = useCallback(() => {
    const el = galleryRef.current;
    if (!el) return;
    const slides = Array.from(el.children).filter(c => (c as HTMLElement).dataset.slide);
    let closest = 0, minD = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs((s as HTMLElement).offsetLeft - el.scrollLeft);
      if (d < minD) { minD = d; closest = i; }
    });
    setActiveThumb(closest);
  }, []);

  const addCart = () => { setCartAdded(true); setTimeout(() => setCartAdded(false), 2000); };
  const buyOne = () => { setOneDone(true); setTimeout(() => setOneDone(false), 2500); };
  const toggleLike = (i: number) => setLiked(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });

  const scrollToSection = (tab: string) => {
    setActiveTab(tab);
    const id = SECTION_IDS[tab as keyof typeof SECTION_IDS];
    if (id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Close mobile menu on outside scroll
  useEffect(() => {
    if (mobileMenuOpen) {
      const close = () => setMobileMenuOpen(false);
      window.addEventListener("scroll", close, { passive: true, once: true });
      return () => window.removeEventListener("scroll", close);
    }
  }, [mobileMenuOpen]);

  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE BOTTOM NAV (fixed) — shown only on mobile
          Structure: [Catalog] [Купить в 1 клик] [Cart] [♡]
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#eeeef4]"
           style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {/* CTA strip */}
        <div className="flex items-center gap-2 px-3 pt-2.5 pb-2">
          <button
            onClick={buyOne}
            className={`flex-1 h-[44px] flex items-center justify-center rounded-[10px] text-white text-[13px] font-medium transition-all active:scale-[0.97] [font-family:'Cera_Pro-Medium',Helvetica] ${oneDone ? "bg-[#78b72a]" : "bg-[#3c3c50]"}`}
          >
            {oneDone ? "Заявка принята ✓" : "Купить в 1 клик"}
          </button>
          <button
            onClick={addCart}
            className={`w-[44px] h-[44px] flex items-center justify-center rounded-[10px] border transition-all active:scale-[0.95] ${cartAdded ? "border-[#78b72a] bg-[#f6fbef]" : "border-[#e0e0ec] bg-[#f8f8fc]"}`}
          >
            <img className="w-5 h-5" alt="Cart" src="/figmaAssets/shopping-bag-4.svg" />
          </button>
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className={`w-[44px] h-[44px] flex items-center justify-center rounded-[10px] border transition-all active:scale-[0.95] ${wishlisted ? "border-[#e40646]/30 bg-[#fff5f7]" : "border-[#e0e0ec] bg-[#f8f8fc]"}`}
          >
            <Heart className={`w-[22px] h-[22px] transition-colors ${wishlisted ? "fill-[#e40646] text-[#e40646]" : "text-[#3c3c50]"}`} strokeWidth={1.5} />
          </button>
        </div>
        {/* Bottom nav */}
        <div className="flex justify-between px-[15px] pt-1 pb-0">
          {[
            { Icon: LayoutGrid, label: "Каталог" },
            { Icon: ShoppingBag, label: "Корзина", badge: 20 },
            { Icon: Heart, label: "Избранное" },
            { Icon: User, label: "Профиль" },
          ].map(item => (
            <button key={item.label} className="flex flex-col items-center gap-1 group w-[64px]">
              <div className="relative flex items-center justify-center w-6 h-6">
                <item.Icon className="w-5 h-5 text-[#3c3c50] opacity-55 group-hover:opacity-80 transition-opacity" strokeWidth={1.5} />
                {item.badge && (
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#3c3c50] rounded-full flex items-center justify-center">
                    <span className="text-white text-[7px] font-medium leading-none [font-family:'Cera_Pro-Medium',Helvetica]">{item.badge}</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#808080] [font-family:'Cera_Pro-Regular',Helvetica] whitespace-nowrap leading-none mb-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP HEADER — exact Figma layout
          Row 1: Location+Phone | Logo (centered) | User+Cosmetologist
          Row 2: 6 nav items full-width
          Separator
          Row 3: Menu+Catalog+Search | ... | Filters+Wishlist+Cart
      ═══════════════════════════════════════════════════════════════════════ */}
      <header className="bg-white w-full">

        {/* ── Row 1: Utility bar (h=52px) ── */}
        <div className="hidden lg:block w-full h-[52px]">
          <div className="max-w-[1520px] mx-auto h-full px-20 flex items-center relative">
            {/* Left: location + phone */}
            <div className="flex items-center gap-5">
              <button className="inline-flex items-center gap-[5px] group cursor-pointer">
                <img className="w-[10px] h-[10px]" alt="" src="/figmaAssets/bold---map---location---map-arrow-right.svg" />
                <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-[11px] leading-[13px] tracking-[0.3px] group-hover:opacity-60 transition-opacity">
                  МОСКВА
                </span>
              </button>
              <button className="inline-flex items-center gap-0.5 group cursor-pointer">
                <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-[11px] leading-[13px] group-hover:opacity-60 transition-opacity">
                  8 800 800 88 88
                </span>
                <img className="w-[4px] h-[4px] ml-0.5 opacity-50" alt="" src="/figmaAssets/polygon-2.svg" />
              </button>
            </div>

            {/* Center: logo — absolute center */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
              <img className="h-[30px] w-[118px] object-contain" alt="Angiopharm" src="/figmaAssets/--------07-1.svg" />
            </div>

            {/* Right: user + cosmetologist */}
            <div className="ml-auto flex items-center gap-[10px]">
              <img className="h-[30px] w-auto object-contain" alt="User" src="/figmaAssets/frame-2087324801.svg" />
              <button className="inline-flex items-center justify-center px-[15px] h-[34px] bg-[#f8f8fc] rounded-[10px] cursor-pointer transition-all hover:bg-[#ebebf7] active:scale-[0.98]">
                <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-[10px] leading-[11.5px] tracking-[0.2px]">
                  ВХОД КОСМЕТОЛОГИ
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Row 2: Navigation items (h=36px) ── */}
        <div className="hidden lg:block w-full h-[36px]">
          <div className="max-w-[1520px] mx-auto h-full px-20 flex items-center justify-between">
            {NAV_ITEMS.map(item => (
              <button key={item} className="group cursor-pointer py-1">
                <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-[11px] leading-[13px] tracking-[0.3px] whitespace-nowrap transition-opacity group-hover:opacity-60">
                  {item}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Desktop Separator ── */}
        <div className="hidden lg:block w-full h-px bg-[#e8e8f0]" />

        {/* ── Row 3: Action bar (h=52px) ── */}
        <div className="hidden lg:block w-full h-[52px]">
          <div className="max-w-[1520px] mx-auto h-full px-20 flex items-center">
            {/* Menu icon */}
            <button className="w-6 h-6 flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-60">
              <img className="w-[18px] h-[18px] lg:w-6 lg:h-6" alt="Menu" src="/figmaAssets/menu.svg" />
            </button>

            {/* Catalog button */}
            <button className="inline-flex h-10 items-center justify-center gap-[7px] px-[22px] ml-9 bg-[#3c3c50] rounded-[50px] transition-all hover:bg-[#2e2e40] active:scale-[0.98] cursor-pointer flex-shrink-0">
              <img className="w-3.5 h-3.5 flex-shrink-0 brightness-0 invert" alt="" src="/figmaAssets/bold---settings--fine-tuning---widget-3.svg" />
              <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-white text-[11px] leading-[13px] tracking-[0.5px] whitespace-nowrap">
                КАТАЛОГ
              </span>
            </button>

            {/* Search bar */}
            <div className="flex w-[372px] h-10 items-center justify-between pl-[27px] pr-[19px] ml-10 bg-[#3c3c501a] rounded-[30px] cursor-text transition-all hover:bg-[#3c3c5026] flex-shrink-0">
              <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c5033] text-[10px] leading-[11.5px]">
                СЫВОРОТКА ...
              </span>
              <img className="w-5 h-5 opacity-40" alt="Search" src="/figmaAssets/search.svg" />
            </div>

            {/* Filter tags */}
            <div className="flex items-center gap-[10px] ml-8">
              {["ПО НАЗНАЧЕНИЮ", "ТИП СРЕДСТВА", "АКТИВЫ"].map(tag => (
                <button key={tag} className="inline-flex h-[21px] items-center justify-center px-[17px] bg-[#f8f8fc] rounded-[10px] cursor-pointer transition-all hover:bg-[#ebebf7] active:scale-[0.98]">
                  <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-[10px] leading-[11.5px] whitespace-nowrap">
                    {tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Wishlist */}
            <button className="w-6 h-6 flex items-center justify-center transition-all hover:opacity-60 active:scale-90 flex-shrink-0" onClick={() => setWishlisted(!wishlisted)}>
              <Heart className={`w-6 h-6 transition-colors ${wishlisted ? "fill-[#e40646] text-[#e40646]" : "text-[#3c3c50]"}`} strokeWidth={1.5} />
            </button>

            {/* Cart with badge */}
            <button className="relative flex items-center cursor-pointer group flex-shrink-0 ml-10">
              <img className="w-6 h-6 transition-opacity group-hover:opacity-60" alt="Cart" src="/figmaAssets/shopping-bag-4.svg" />
              <div className="absolute -top-1.5 -right-2 w-5 h-5 flex items-center justify-center bg-[#3c3c50] rounded-full">
                <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-white text-[9px] leading-none">20</span>
              </div>
            </button>
          </div>
        </div>

        {/* ── MOBILE HEADER ── */}
        <div className="lg:hidden flex items-center h-[52px] px-4 relative border-b border-[#f0f0f4]">
          {/* Hamburger */}
          <button className="w-8 h-8 flex items-center justify-center flex-shrink-0" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <rect width="20" height="1.5" rx="0.75" fill="#3c3c50"/>
              <rect y="6" width="14" height="1.5" rx="0.75" fill="#3c3c50"/>
              <rect y="12" width="20" height="1.5" rx="0.75" fill="#3c3c50"/>
            </svg>
          </button>

          {/* Logo centered */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <img className="h-[26px] w-auto object-contain" alt="Angiopharm" src="/figmaAssets/--------07-1.svg" />
          </div>

          {/* Right: search */}
          <div className="ml-auto flex items-center">
            <button className="w-8 h-8 flex items-center justify-center">
              <img className="w-[18px] h-[18px] opacity-50" alt="Search" src="/figmaAssets/search.svg" />
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 z-40 bg-white border-b border-[#f0f0f4] shadow-xl">
            <div className="px-5 py-4">
              {/* Nav sections */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {NAV_ITEMS.map(item => (
                  <button key={item} className="text-left px-3 py-2.5 rounded-[8px] bg-[#f8f8fc] [font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-[11px] tracking-[0.3px]">
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-[#f0f0f4] pt-3">
                <img className="h-5 w-auto" alt="" src="/figmaAssets/bold---map---location---map-arrow-right.svg" />
                <span className="[font-family:'Cera_Pro-Medium',Helvetica] text-[#3c3c50] text-xs">МОСКВА · 8 800 800 88 88</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
          — Desktop: max-w-[1520px] px-20
          — Mobile: px-4, pb for bottom nav
      ═══════════════════════════════════════════════════════════════════════ */}
      <main className="max-w-[1520px] mx-auto px-5 lg:px-20 pb-[120px] lg:pb-0">

        {/* ── BREADCRUMB ── */}
        <div className="flex items-center gap-[7px] lg:gap-2.5 py-[12px] lg:py-[18px] overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
          {["Главная", "Каталог", "Новинки"].map(c => (
            <div key={c} className="flex items-center gap-[7px] lg:gap-2.5 flex-shrink-0">
              <button className="border-b border-[#bababa] pb-px cursor-pointer hover:opacity-60 transition-opacity">
                <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#bababa] text-[10px] lg:text-xs">{c}</span>
              </button>
              <div className="w-[3px] h-[3px] bg-[#bababa] rounded-full" />
            </div>
          ))}
          <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#bababa] text-[10px] lg:text-xs flex-shrink-0 truncate">Лимфодренажный крем для лица</span>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            PRODUCT SECTION
            Desktop: 2 columns: gallery (695px) | details (531px)
            Mobile: stacked
        ═══════════════════════════════════════════════════════════════════ */}
        {/* Gallery 0–734px from content-left (=canvas 80+734=814px), details at 734px from content = 814px from canvas */}
        <div className="pt-4 lg:pt-0 flex flex-col lg:grid" style={{ gridTemplateColumns: "734px 1fr" }}>

          {/* ── GALLERY ── */}
          <div>
            {/* Mobile: badges above gallery */}
            <div className="flex items-center gap-[5px] flex-wrap mb-3 lg:hidden">
              {PRODUCT.badges.map(b => (
                <div key={b.label} style={{ backgroundColor: b.color }}
                  className="inline-flex items-center justify-center gap-[3px] px-[9px] py-[5px] rounded-[5px]">
                  <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-white text-[10px] leading-[11.5px] whitespace-nowrap">{b.label}</span>
                  {b.hasIcon && <img className="w-[9px] h-[9px]" alt="" src="/figmaAssets/subtract.svg" />}
                </div>
              ))}
            </div>

            {/* Desktop gallery: thumbnails left + main image */}
            <div className="hidden lg:flex gap-[13px]">
              {/* Thumbnail strip */}
              <div className="flex flex-col gap-[5px] pt-0 flex-shrink-0">
                <button className="w-[34px] h-[34px] flex items-center justify-center transition-opacity hover:opacity-60">
                  <img className="w-[34px] h-[34px]" style={{ transform: "rotate(90deg)" }} alt="" src="/figmaAssets/arrow-right-1.svg" />
                </button>
                {variant.thumbnails.map((t, i) => (
                  <button key={`${activeVol}-${i}`} onClick={() => { setActiveThumb(i); }}
                    className={`w-[42px] h-[42px] rounded-[4px] overflow-hidden border transition-all ${activeThumb === i ? "border-[#3c3c50] opacity-100 border-[1.5px]" : "border-[#e0e0e0] opacity-55 hover:opacity-85"}`}>
                    <img src={t} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="w-[559px] h-[553px] flex-shrink-0 flex items-center justify-center bg-[#f7f7f9] rounded-[4px] overflow-hidden">
                <img key={`${activeVol}-${activeThumb}`} src={variant.thumbnails[activeThumb]} alt={PRODUCT.name}
                  className="w-full h-full object-contain"
                  style={{ animation: "imgFadeIn .25s ease-in-out" }} />
              </div>
            </div>

            {/* Mobile gallery: horizontal swipe */}
            <div className="lg:hidden relative">
              <div ref={galleryRef} onScroll={onGalleryScroll}
                className="flex overflow-x-auto snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", gap: "12px" }}>
                {variant.thumbnails.map((t, i) => (
                  <div key={`${activeVol}-${i}`} data-slide="1"
                    className="flex-shrink-0 snap-start bg-[#f5f5f8] rounded-[12px] overflow-hidden flex items-center justify-center p-4"
                    style={{ width: "calc(100vw - 56px)", height: "300px" }}>
                    <img src={t} alt={`Фото ${i + 1}`} className="w-full h-full object-contain" />
                  </div>
                ))}
                <div className="flex-shrink-0 w-2" />
              </div>
              {/* Dot indicators */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {variant.thumbnails.map((_, i) => (
                  <button key={i} onClick={() => scrollToThumb(i)}
                    className={`rounded-full transition-all duration-200 ${activeThumb === i ? "w-[18px] h-[5px] bg-[#3c3c50]" : "w-[5px] h-[5px] bg-[#d4d4dc]"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* ── PRODUCT DETAILS ── */}
          <div className="flex flex-col gap-[18px] lg:gap-[22px] mt-4 lg:mt-0 lg:max-w-[531px]">

            {/* Badges (desktop) */}
            <div className="hidden lg:flex items-center gap-[5px] flex-wrap order-0 lg:order-none">
              {PRODUCT.badges.map(b => (
                <div key={b.label} style={{ backgroundColor: b.color }}
                  className="inline-flex items-center justify-center gap-[3px] px-[9px] py-1 rounded-[5px]">
                  <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-white text-xs leading-[13.8px] whitespace-nowrap">{b.label}</span>
                  {b.hasIcon && <img className="w-[11px] h-[11px]" alt="" src="/figmaAssets/subtract.svg" />}
                </div>
              ))}
            </div>

            {/* Rating */}
            <button className="order-8 lg:order-none self-start inline-flex items-center gap-[7px] px-[9px] py-1 bg-[#f7f7f7] rounded-[5px] cursor-pointer transition-all hover:bg-[#ebebeb]">
              <div className="inline-flex items-center gap-[3px]">
                <img className="w-3 h-3" alt="★" src="/figmaAssets/vuesax-bold-ranking.svg" />
                <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-sm">{PRODUCT.rating}</span>
              </div>
              <div className="border-b border-[#bababa] pb-px">
                <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#bababa] text-xs">{PRODUCT.reviewCount} отзывов</span>
              </div>
            </button>

            {/* Name */}
            <div className="flex flex-col gap-[3px] order-1 lg:order-none">
              <div className="inline-flex items-center gap-[5px]">
                <img className="w-3.5 h-3.5" alt="" src="/figmaAssets/bold---essentional--ui---check-circle.svg" />
                <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#78b72a] text-sm leading-[16.1px]">В наличии</span>
              </div>
              <h1 className="[font-family:'Cera_Pro-Regular',Helvetica] font-normal text-[#3c3c50] text-[22px] lg:text-[25px] tracking-[-1.1px] lg:tracking-[-1.25px] leading-[1.15]">
                {PRODUCT.name}, {activeVol} мл
              </h1>
              <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#bababa] text-sm leading-[16.1px]">Арт. {PRODUCT.id}</span>
            </div>

            {/* Price + bonuses */}
            <div className="inline-flex items-center gap-[9px] order-2 lg:order-none">
              <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-[22px] leading-[25.3px]">
                {variant.price.toLocaleString("ru-RU")} ₽
              </span>
              {variant.oldPrice && (
                <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#bababa] text-sm line-through">
                  {variant.oldPrice.toLocaleString("ru-RU")} ₽
                </span>
              )}
              <div className="inline-flex items-center gap-px">
                <img className="h-[18px] w-auto" alt="" src="/figmaAssets/frame-2087324734.svg" />
                <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-black text-base leading-[19.2px]">+{variant.bonusPoints}</span>
              </div>
            </div>

            {/* Volume selector */}
            <div className="flex flex-col gap-[9px] order-3 lg:order-none">
              <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-sm leading-[16.1px]">Объём, мл</span>
              <div className="flex items-center gap-[5px]">
                {[7, 30, 50].map(v => (
                  <button key={v} onClick={() => switchVolume(v)}
                    className={`flex w-[45px] h-[34px] items-center justify-center rounded-[20px] transition-all duration-200 cursor-pointer ${activeVol === v ? "bg-[#f9f9ff] ring-1 ring-[#3c3c50]/20" : "border border-[#f2f2f2] hover:border-[#3c3c50]/30 hover:bg-[#fafafa]"}`}>
                    <span className={`[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-sm transition-colors ${activeVol === v ? "text-[#3c3c50]" : "text-[#bababa]"}`}>{v}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile: tab scroll anchors */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-0.5 order-4" style={{ scrollbarWidth: "none" }}>
              {TABS.map(t => (
                <button key={t} onClick={() => scrollToSection(t)}
                  className={`flex-shrink-0 h-[28px] px-3 rounded-[20px] text-[10px] whitespace-nowrap transition-all ${activeTab === t ? "[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-white bg-[#3c3c50]" : "[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] bg-[#f0f0f6] hover:bg-[#e8e8f2]"}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Short description */}
            <p className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-sm leading-[20px] order-6 lg:order-none">
              {variant.shortDesc}
            </p>

            {/* Specs */}
            <div className="flex flex-col gap-[14px] order-7 lg:order-none mt-4">
              {PRODUCT.specs.map(spec => (
                <div key={spec.label} className="flex w-full items-start">
                  <div className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#bababa] text-sm leading-[20px] whitespace-nowrap tracking-[0.2px]">
                    {spec.label}
                  </div>
                  <div className="flex-1 mt-[15px] mx-1.5 border-t border-dotted border-[#bababa] opacity-80 min-w-[5px]" />
                  <div className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-sm leading-[20px] text-left w-[180px] lg:w-[260px] shrink-0">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Installment */}
            <button className="flex items-center justify-between pl-[15px] pr-2.5 py-[11px] w-full bg-[#f9f8ff] rounded-[10px] cursor-pointer transition-all hover:bg-[#f0eff9] group order-5 lg:order-none">
              <div className="inline-flex items-center gap-2.5 min-w-0">
                <img className="w-4 h-4 flex-shrink-0" alt="" src="/figmaAssets/bold---settings--fine-tuning---widget-3.svg" />
                <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-sm leading-[18px] text-left">
                  Разбейте платёж{" "}
                  <strong className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium">на 4 части по {variant.installmentAmount} ₽</strong>{" "}
                  без переплат
                </span>
              </div>
              <img className="w-3 h-3 flex-shrink-0 ml-2 transition-transform group-hover:translate-x-[2px]" alt="" src="/figmaAssets/outline---arrows---arrow-right.svg" />
            </button>

            {/* CTA group (desktop only) */}
            <div className="hidden lg:flex flex-col gap-[7px] order-9 lg:order-none">
              <button onClick={buyOne}
                className={`w-full h-[49px] flex items-center justify-center rounded-[10px] cursor-pointer transition-all duration-200 active:scale-[0.98] ${oneDone ? "bg-[#78b72a]" : "bg-[#3c3c50] hover:bg-[#323244]"}`}>
                <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-white text-sm">
                  {oneDone ? "Заявка принята ✓" : "Купить в 1 клик"}
                </span>
              </button>
              <div className="flex gap-[7px]">
                <button onClick={addCart}
                  className={`flex flex-1 h-[44px] items-center justify-center rounded-[10px] border transition-all duration-200 active:scale-[0.98] cursor-pointer ${cartAdded ? "border-[#78b72a] bg-[#f6fbef] text-[#5e9320]" : "border-[#e0e0ec] bg-[#f8f8fc] hover:bg-[#f0eff9] hover:border-[#c8c8dc] text-[#3c3c50]"}`}>
                  <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-sm">{cartAdded ? "Добавлено ✓" : "В корзину"}</span>
                </button>
                <button onClick={() => setWishlisted(!wishlisted)}
                  className={`w-[44px] h-[44px] flex items-center justify-center flex-shrink-0 rounded-[10px] border transition-all duration-200 active:scale-[0.95] cursor-pointer ${wishlisted ? "border-[#e40646]/30 bg-[#fff5f7]" : "border-[#e0e0ec] bg-[#f8f8fc] hover:bg-[#f0eff9] hover:border-[#c8c8dc]"}`}>
                  <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                    <path d="M9 14.5C9 14.5 1.5 9.5 1.5 4.75C1.5 3.093 2.836 1.75 4.5 1.75C5.986 1.75 7.244 2.731 7.7 4.063H10.3C10.756 2.731 12.015 1.75 13.5 1.75C15.164 1.75 16.5 3.093 16.5 4.75C16.5 9.5 9 14.5 9 14.5Z"
                      stroke={wishlisted ? "#e40646" : "#3c3c50"} fill={wishlisted ? "#e40646" : "none"}
                      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── QUICK LINKS (desktop) ── */}
        <div className="hidden lg:flex items-center gap-8 pt-8 pb-2">
          {QUICK_LINKS.map(ql => (
            <button key={ql.label} className="inline-flex items-center gap-2 group cursor-pointer">
              <img className="w-3.5 h-3.5 transition-opacity group-hover:opacity-60" alt="" src={ql.icon} />
              <div className="border-b border-[#3c3c50] pb-px group-hover:opacity-60 transition-opacity">
                <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-xs">{ql.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            CONTENT TABS
            Desktop: horizontal tabs + content below
            Mobile: each section is always visible with scroll anchor
        ═══════════════════════════════════════════════════════════════════ */}
        <div className="mt-8 lg:mt-6">
          {/* Desktop tabs */}
          <div className="hidden lg:flex items-center gap-0 border-b border-[#ebebf0]">
            {TABS.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`pb-3 mr-6 text-xs leading-[13.8px] whitespace-nowrap transition-all border-b-2 -mb-px ${activeTab === t ? "[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] border-[#3c3c50]" : "[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] opacity-40 border-transparent hover:opacity-70"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Desktop tab content */}
          <div className="hidden lg:flex flex-col gap-[25px] pt-8 pb-10 max-w-[600px]">
            {PRODUCT.tabs[activeTab]?.map(s => (
              <div key={s.title} className="flex flex-col gap-2">
                <div className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-sm">{s.title}</div>
                <div className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-sm leading-[20px]">{s.text}</div>
              </div>
            ))}
          </div>

          {/* Mobile: all sections as accordion-like expandable */}
          <div className="lg:hidden flex flex-col">
            {TABS.map(t => {
              const isOpen = mobileAccordion === t;
              return (
                <div key={t} id={SECTION_IDS[t as keyof typeof SECTION_IDS]} className="border-b border-[#f0f0f4]">
                  <button onClick={() => setMobileAccordion(isOpen ? null : t)}
                    className="w-full flex items-center justify-between py-4">
                    <span className={`text-sm leading-[16.1px] transition-all ${isOpen ? "[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50]" : "[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50]"}`}>{t}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      <path d="M3 5L7 9L11 5" stroke="#3c3c50" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="flex flex-col gap-4 pb-4">
                      {PRODUCT.tabs[t]?.map(s => (
                        <div key={s.title} className="flex flex-col gap-1.5">
                          <div className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-xs">{s.title}</div>
                          <div className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-xs leading-[18px]">{s.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            REVIEWS
            Desktop: rating panel + horizontal row of review cards (no wrap)
            Mobile: rating summary + horizontal scroll cards
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="pt-10 lg:pt-12 border-t border-[#f0f0f4] mt-4 lg:mt-0">
          <div className="flex items-baseline gap-2 mb-6">
            <h2 className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-[22px] lg:text-[25px] tracking-[-1.1px] lg:tracking-[-1.25px] leading-6">отзывы</h2>
            <span className="opacity-40 [font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-sm">{REVIEWS.length}</span>
          </div>

          {/* Rating summary */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 mb-6 lg:mb-8">
            {/* Photos */}
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-[17px] tracking-[-0.5px]">Фото и видео покупателей</div>
              <div className="flex gap-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <button key={i} className="relative flex-shrink-0 w-[74px] h-[74px] lg:w-20 lg:h-20 bg-[#d9d9d9] rounded-[10px] flex items-center justify-center overflow-hidden hover:brightness-90 active:scale-95 transition-all">
                    {i < 5 ? <img className="w-[17px] h-[20px]" alt="Play" src="/figmaAssets/polygon-1.svg" />
                      : <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-white text-sm">+10</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating stats */}
            <div className="flex flex-col gap-3 lg:w-[450px] flex-shrink-0">
              <div className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-[17px] tracking-[-0.5px]">Рейтинг товара</div>
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-1">
                  <div className="inline-flex items-center gap-[7px] px-[9px] py-1 bg-[#f7f7f7] rounded-[5px]">
                    <img className="w-3 h-3" alt="★" src="/figmaAssets/vuesax-bold-ranking.svg" />
                    <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-sm">{PRODUCT.rating}</span>
                    <div className="border-b border-[#bababa] pb-px">
                      <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#bababa] text-xs">{PRODUCT.reviewCount} отзывов</span>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-[7px] px-[9px] py-1 bg-[#f7f7f7] rounded-[5px]">
                    <img className="w-3 h-3" alt="★" src="/figmaAssets/vuesax-bold-ranking.svg" />
                    <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-sm">98%</span>
                    <div className="border-b border-[#bababa] pb-px">
                      <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#bababa] text-xs">Нравится</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[6px] flex-1">
                  {RATING_BARS.map(b => (
                    <div key={b.star} className="flex items-center gap-[10px]">
                      <span className="w-2 [font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-[10px] text-right flex-shrink-0">{b.star}</span>
                      <div className="relative flex-1 h-[3px] bg-[#d9d9d9] rounded-[500px]">
                        {b.pct > 0 && <div style={{ width: `${b.pct}%` }} className="absolute top-0 left-0 h-[3px] bg-[#f9b429] rounded-[70px]" />}
                      </div>
                      <span className="w-3 [font-family:'Cera_Pro-Regular',Helvetica] text-[#bababa] text-[10px] text-right flex-shrink-0">{b.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-[17px] tracking-[-0.5px] mb-4">Отзывы покупателей</div>

          {/* Desktop: horizontal row, no wrap — matching Figma */}
          <div className="hidden lg:flex items-stretch gap-2.5 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {REVIEWS.map((r, i) => (
              <div key={i} className="flex-shrink-0 w-[270px]">
                <ReviewCard review={r} liked={liked.has(i)} onLike={() => toggleLike(i)} />
              </div>
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="lg:hidden flex overflow-x-auto gap-3 pb-2" style={{ scrollbarWidth: "none" }}>
            {REVIEWS.map((r, i) => (
              <div key={i} className="flex-shrink-0 w-[260px]">
                <ReviewCard review={r} liked={liked.has(i)} onLike={() => toggleLike(i)} />
              </div>
            ))}
          </div>

          <button className="flex w-[181px] h-[52px] items-center justify-between pl-6 pr-[18px] mt-6 bg-[#ececec] rounded-[10px] cursor-pointer transition-all hover:bg-[#e0e0e0] active:scale-[0.98] group">
            <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-[13px]">ВСЕ ОТЗЫВЫ</span>
            <img className="w-5 h-5 transition-transform group-hover:translate-x-[2px]" alt="→" src="/figmaAssets/arrow-right-6.svg" />
          </button>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            NEW PRODUCTS
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="pt-12 lg:pt-16 mt-8 lg:mt-4 border-t border-[#f0f0f4]">
          <div className="flex items-center justify-between mb-7">
            <h2 className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-[22px] lg:text-[25px] tracking-[-1.1px] lg:tracking-[-1.25px] leading-6">Новинки</h2>
            <button className="inline-flex items-center gap-[3px] group cursor-pointer">
              <div className="border-b border-black pb-px group-hover:opacity-60 transition-opacity">
                <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-xs lg:text-sm">СМОТРЕТЬ ВСЕ ТОВАРЫ</span>
              </div>
              <img className="w-4 h-4 transition-transform group-hover:translate-x-[2px]" alt="→" src="/figmaAssets/arrow-right-4.svg" />
            </button>
          </div>

          {/* Mobile: horizontal scroll | Desktop: 4-col grid */}
          <div className="flex overflow-x-auto gap-3 lg:gap-[13px] lg:grid lg:grid-cols-4" style={{ scrollbarWidth: "none" }}>
            {NEW_PRODUCTS.map((p, i) => (
              <div key={i} className="flex-shrink-0 w-[200px] lg:w-auto flex flex-col gap-[7px] cursor-pointer group">
                <div className="relative overflow-hidden rounded-[8px] lg:rounded-none" style={{ aspectRatio: "1/1" }}>
                  <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" alt={p.name} src={p.image} />
                  <div className="absolute top-0 left-0 bg-[#86b1f2] px-[9px] py-1 rounded-[5px]">
                    <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-white text-xs">{p.badge}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 w-[42px] h-[42px] lg:w-[50px] lg:h-[50px] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                    <img className="w-full h-full" alt="" src="/figmaAssets/shopping-bag.svg" />
                  </div>
                </div>
                <div className="inline-flex items-center gap-[5px]">
                  <img className="w-3 h-3 lg:w-3.5 lg:h-3.5" alt="" src="/figmaAssets/bold---essentional--ui---check-circle.svg" />
                  <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#78b72a] text-xs">В наличии</span>
                </div>
                <div className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-sm lg:text-base leading-[18px] group-hover:opacity-70 transition-opacity">{p.name}</div>
                <div className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-sm lg:text-base">{p.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            BENEFITS — segmented from frame-71.svg
            Desktop: 4 columns
            Mobile: 2x2 grid (Mobile First)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="pt-10 lg:pt-16 mt-6 lg:mt-4 border-t border-[#f0f0f4] mb-8">
          <div className="max-w-[1134px] mx-auto px-4 lg:px-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-2 lg:gap-x-4 justify-items-center">
              {BENEFITS.map((text, i) => {
                const offsets = [0, -338, -675, -1012];
                return (
                  <div key={i} className="flex flex-col items-center gap-[15px] lg:gap-4 w-full">
                    <div className="w-[122px] h-[122px] bg-no-repeat rounded-[15px]"
                         style={{
                           backgroundImage: "url('/figmaAssets/frame-71.svg')",
                           backgroundPosition: `${offsets[i]}px 0px`,
                           backgroundSize: "1134px 122px"
                         }}
                    />
                    <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-sm lg:text-base tracking-[-0.3px] lg:tracking-[-0.5px] leading-[18px] lg:leading-[22px] whitespace-pre-line text-center max-w-[140px] lg:max-w-[180px]">
                      {text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          SOCIAL + FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="mt-12 lg:mt-16 pb-[160px] lg:pb-0">
        <div className="max-w-[1520px] mx-auto px-5 lg:px-20">
          {/* Two-panel container */}
          <div className="flex flex-col lg:flex-row rounded-[10px] overflow-hidden gap-3 lg:gap-0">

            {/* Dark left panel */}
            <div className="bg-[#3c3c50] rounded-[10px] lg:rounded-r-none p-8 lg:p-10 flex flex-col gap-5 lg:w-[440px] lg:min-w-[440px]">
              <img className="h-[40px] lg:h-[54px] w-auto object-contain object-left" alt="Angiopharm" src="/figmaAssets/--------07-2.svg" />
              <div className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-white text-sm tracking-[0.3px]">ПРОФЕССИОНАЛЬНАЯ КОСМЕТИКА</div>
              <div className="mt-3 flex flex-col gap-3">
                <div className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-white text-[21px] leading-[24px]">8 (800) 600-73-82</div>
                <div className="opacity-40 [font-family:'Cera_Pro-Regular',Helvetica] text-white text-xs tracking-[0.2px]">АДРЕС</div>
                <div className="[font-family:'Cera_Pro-Regular',Helvetica] text-white text-xs leading-[16px] opacity-75">
                  630559, Новосибирская область, р.п. Кольцово, пр-кт Академика Сандахчиева, зд.13. E-mail:{" "}
                  <a href="mailto:web@angiopharm.com" className="underline hover:opacity-80">web@angiopharm.com</a>.{" "}
                  ОГРН: 1175476080900
                </div>
              </div>
              {/* Payment icons */}
              <div className="flex items-center gap-3 flex-wrap mt-2">
                <div className="relative w-[52px] h-[36px]">
                  <img className="absolute" style={{ width: "81%", height: "32%", top: "35%", left: "8%" }} alt="" src="/figmaAssets/combined-shape-1.svg" />
                  <img className="absolute" style={{ width: "24%", height: "13%", top: "35%", left: "66%" }} alt="" src="/figmaAssets/path24.svg" />
                </div>
                <div className="relative w-[52px] h-[36px]">
                  <img className="absolute" style={{ width: "11%", height: "35%", top: "33%", left: "37%" }} alt="" src="/figmaAssets/polygon9.svg" />
                  <img className="absolute" style={{ width: "20%", height: "36%", top: "32%", left: "48%" }} alt="" src="/figmaAssets/path11.svg" />
                  <img className="absolute" style={{ width: "24%", height: "35%", top: "33%", left: "67%" }} alt="" src="/figmaAssets/path13.svg" />
                  <img className="absolute" style={{ width: "30%", height: "35%", top: "33%", left: "8%" }} alt="" src="/figmaAssets/combined-shape.svg" />
                </div>
                <div className="relative w-[52px] h-[36px]">
                  <img className="absolute top-[5px] left-[10px] w-[33px] h-[25px]" alt="" src="/figmaAssets/group.png" />
                </div>
                <img className="h-5 w-auto" alt="SBP" src="/figmaAssets/sbp-logo-1.svg" />
              </div>
              <div className="[font-family:'Cera_Pro-Regular',Helvetica] text-white text-xs opacity-50 mt-2">
                <a href="http://angiopharm.com/" rel="noopener noreferrer" target="_blank" className="underline hover:opacity-80">Ангиофарм</a>{" "}
                © ООО ЛАБОРАТОРИЯ АНГИОФАРМ, 2026
              </div>
            </div>

            {/* Right panel: social gradient + nav columns */}
            <div className="flex-1 flex flex-col min-w-0 rounded-[10px] lg:rounded-l-none overflow-hidden">
              {/* Social gradient */}
              <div className="p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 relative overflow-hidden"
                style={{ background: "linear-gradient(128deg, rgba(248,248,251,1) 0%, rgba(229,229,235,1) 100%)" }}>
                <div className="flex-1 min-w-0">
                  <p className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-[18px] lg:text-[22px] tracking-[-0.9px] lg:tracking-[-1.1px] leading-[24px] lg:leading-[26px] max-w-[290px]">
                    Следите за спец предложениями, новостями и акциями в наших социальных сетях
                  </p>
                  <div className="flex items-center gap-2 mt-5 flex-wrap">
                    {SOCIALS.map(s => (
                      <button key={s.label}
                        className="inline-flex items-center gap-[12px] pl-[20px] pr-[26px] py-[11px] bg-white rounded-[500px] cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
                        <img className="w-5 h-5 lg:w-[23px] lg:h-[23px] flex-shrink-0 object-contain" alt={s.label} src={s.icon} />
                        <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-[12px] lg:text-[13px] leading-[14.9px]">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <img className="hidden lg:block w-[200px] xl:w-[253px] h-auto object-contain flex-shrink-0"
                  alt="Social" src="/figmaAssets/ntktajy-d-hert-1.png" />
              </div>

              {/* Nav columns */}
              <div className="bg-[#f7f7fb] p-8 lg:p-10 flex-1">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                  {FOOTER_COLS.map(col => (
                    <div key={col.title} className="flex flex-col gap-3 lg:gap-[18px]">
                      <div className="opacity-50 [font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-xs lg:text-sm">{col.title}</div>
                      {col.links.map(link => (
                        <button key={link} className="text-left [font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-xs lg:text-base leading-[18.4px] cursor-pointer hover:opacity-60 transition-opacity">{link}</button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-6 lg:h-8" />
      </footer>

      {/* CSS */}
      <style>{`
        @keyframes imgFadeIn { from { opacity: 0 } to { opacity: 1 } }
        * { -ms-overflow-style: none; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// ─── REVIEW CARD ────────────────────────────────────────────────────────────────

function ReviewCard({
  review, liked, onLike,
}: {
  review: typeof REVIEWS[0];
  liked: boolean;
  onLike: () => void;
}) {
  return (
    <div className={`flex flex-col w-full min-h-[213px] justify-between p-[22px] lg:p-[25px] rounded-[10px] border cursor-pointer transition-all duration-200 h-full ${review.isCosmetologist ? "border-[#e40646] hover:shadow-[0_4px_20px_rgba(228,6,70,0.12)]" : "border-[#bababa] hover:border-[#3c3c50]/40 hover:shadow-[0_4px_16px_rgba(60,60,80,0.08)]"}`}>
      <div className="flex flex-col gap-[10px] lg:gap-[11px]">
        {review.isCosmetologist && (
          <div className="inline-flex items-center gap-[5px] px-2.5 py-[3px] bg-[#e40646] rounded-[10px] self-start">
            <img className="w-[15px] h-[15px]" alt="" src="/figmaAssets/bold---like---medal-ribbons-star.svg" />
            <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-white text-[10px]">Косметолог рекомендует</span>
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="[font-family:'Cera_Pro-Medium',Helvetica] font-medium text-[#3c3c50] text-sm">{review.name}</span>
          <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#bababa] text-xs whitespace-nowrap flex-shrink-0">{review.date}</span>
        </div>
        <div className="inline-flex items-center gap-px">
          {[1,2,3,4,5].map(s => <img key={s} className="w-[14px] h-[14px]" alt="★" src="/figmaAssets/vuesax-bold-ranking.svg" />)}
        </div>
        <p className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#3c3c50] text-xs leading-[15px]">{review.text}</p>
      </div>
      <div className="inline-flex items-center gap-[17px] mt-3">
        <button onClick={e => { e.stopPropagation(); onLike(); }}
          className={`inline-flex items-center gap-1 cursor-pointer transition-all hover:scale-110 active:scale-90 ${liked ? "opacity-100" : "opacity-60"}`}>
          <img className="w-[13px] h-[13px]" alt="Like" src="/figmaAssets/outline---like---like-1.svg" />
          <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#bababa] text-sm">{liked ? review.likes + 1 : review.likes}</span>
        </button>
        <div className="inline-flex items-center gap-1 opacity-60 hover:opacity-80 transition-opacity">
          <img className="w-[13px] h-[13px]" alt="Dislike" src="/figmaAssets/outline---like---dislike-1.svg" />
          <span className="[font-family:'Cera_Pro-Regular',Helvetica] text-[#bababa] text-sm">{review.dislikes}</span>
        </div>
      </div>
    </div>
  );
}
