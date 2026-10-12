import { Link } from "@tanstack/react-router";
import { Instagram, Menu, Search, ShoppingBag, X } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import logo from "@/assets/logo.png.asset.json";
import { BRAND, COLORS, type ColorId, type Product } from "@/data/products";
import { useStore } from "@/lib/store";

export function Header() {
  const { t, lang, setLang, cart } = useStore();
  const [open, setOpen] = useState(false);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const links = [
    { to: "/collection", label: t("collection") },
    { to: "/about", label: t("about") },
    { to: "/contact", label: t("contact") },
  ] as const;
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8">
        <nav className="flex items-center gap-6 text-sm">
          <button className="md:hidden" aria-label={t("menu")} onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hidden hover:text-accent md:inline" activeProps={{ className: "text-accent" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link to="/" className="flex items-center justify-center" aria-label="Linen Line">
          <img src={logo.url} alt="" className="h-6 w-auto" />
        </Link>
        <div className="flex items-center justify-end gap-4">
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="font-latin text-sm hover:text-accent">
            {lang === "ar" ? "EN" : "ع"}
          </button>
          <Link to="/collection" aria-label={t("search")} className="hover:text-accent"><Search size={19} /></Link>
          <Link to="/cart" aria-label={t("cart")} className="relative hover:text-accent">
            <ShoppingBag size={19} />{count > 0 && <Badge n={count} />}
          </Link>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col border-t px-4 py-4 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="border-b py-3 last:border-0">{l.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return <span className="absolute -top-2 -end-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] text-accent-foreground">{n}</span>;
}

export function Footer() {
  const { t, b } = useStore();
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="font-latin text-2xl tracking-[0.25em]">LINEN LINE</p>
          <p className="mt-3 font-display text-lg">{b(BRAND.tagline)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{b(BRAND.location)}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/collection" className="hover:text-accent">{t("collection")}</Link>
          <Link to="/about" className="hover:text-accent">{t("about")}</Link>
          <Link to="/size-guide" className="hover:text-accent">{t("sizeGuide")}</Link>
          <Link to="/contact" className="hover:text-accent">{t("contact")}</Link>
        </div>
        <div className="text-sm">
          <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
            <Instagram size={16} /> <span dir="ltr">{BRAND.instagramHandle}</span>
          </a>
          <p className="mt-3 text-muted-foreground">{t("replyHours")}: {b(BRAND.hours)}</p>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Linen Line</div>
    </footer>
  );
}

export function BottomGlass() {
  const [atEnd, setAtEnd] = React.useState(false);
  React.useEffect(() => {
    const check = () =>
      setAtEnd(document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) <= 2);
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
  return (
    <div aria-hidden="true" className={`bottom-glass ${atEnd ? "is-hidden" : ""}`}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className={`b${i + 1}`} />
      ))}
    </div>
  );
}

export function Swatch({ id, active, onClick, label }: { id: ColorId; active?: boolean; onClick?: () => void; label: string }) {
  const cls = `block h-6 w-6 rounded-full ${COLORS[id].swatch} ring-offset-2 ring-offset-background ${active ? "ring-1 ring-foreground" : ""}`;
  return onClick ? (
    <button type="button" onClick={onClick} aria-label={label} aria-pressed={active} className={cls} />
  ) : (
    <span title={label} className={`${cls} h-3.5 w-3.5`} />
  );
}

export function ProductCard({ p, color }: { p: Product; color: ColorId }) {
  const { b, t } = useStore();
  const c = p.colors.find((x) => x.id === color)!;
  return (
    <article data-reveal className="group">
      <div className="relative overflow-hidden bg-muted">
        <Link to="/product/$slug" params={{ slug: p.slug }} search={{ color }}>
          <img src={c.images[0]!.src} alt={b(c.images[0]!.alt)} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        </Link>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to="/product/$slug" params={{ slug: p.slug }} search={{ color }} className="font-display text-lg hover:text-accent">
            {b(p.name)} — {b(COLORS[color].name)}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{p.price != null ? `${p.price} ${p.currency ?? ""}` : t("priceOnRequest")}</p>
        </div>
        <div className="flex shrink-0 gap-1.5 pt-2">
          {p.colors.map((x) => <Swatch key={x.id} id={x.id} label={b(COLORS[x.id].name)} />)}
        </div>
      </div>
    </article>
  );
}
