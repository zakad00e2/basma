import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Bi, ColorId } from "@/data/products";
import { dict, type Lang } from "@/data/i18n";

export type CartItem = { slug: string; color: ColorId; size: string; qty: number };

type Store = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: keyof typeof dict.ar) => string;
  b: (v: Bi) => string;
  cart: CartItem[];
  addToCart: (i: Omit<CartItem, "qty">) => void;
  setQty: (i: CartItem, qty: number) => void;
  removeItem: (i: CartItem) => void;
  favs: string[];
  toggleFav: (key: string) => void;
};

const Ctx = createContext<Store | null>(null);
const same = (a: CartItem, b: Omit<CartItem, "qty">) => a.slug === b.slug && a.color === b.color && a.size === b.size;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangS] = useState<Lang>("ar");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("ll-cart") || "[]"));
      setFavs(JSON.parse(localStorage.getItem("ll-favs") || "[]"));
      const l = localStorage.getItem("ll-lang");
      if (l === "en" || l === "ar") setLangS(l);
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("ll-cart", JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => { if (ready) localStorage.setItem("ll-favs", JSON.stringify(favs)); }, [favs, ready]);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    if (ready) localStorage.setItem("ll-lang", lang);
  }, [lang, ready]);

  const value: Store = {
    lang,
    setLang: setLangS,
    t: (k) => dict[lang][k],
    b: (v) => v[lang],
    cart,
    addToCart: (i) => setCart((c) => (c.some((x) => same(x, i)) ? c.map((x) => (same(x, i) ? { ...x, qty: x.qty + 1 } : x)) : [...c, { ...i, qty: 1 }])),
    setQty: (i, qty) => setCart((c) => c.map((x) => (same(x, i) ? { ...x, qty: Math.max(1, qty) } : x))),
    removeItem: (i) => setCart((c) => c.filter((x) => !same(x, i))),
    favs,
    toggleFav: (k) => setFavs((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k])),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}
