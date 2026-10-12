import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Instagram, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND, COLORS, getProduct, type ColorId } from "@/data/products";
import { useStore } from "@/lib/store";
import { Swatch } from "@/components/Layout";

export const Route = createFileRoute("/product/$slug")({
  validateSearch: (s: any): { color?: ColorId | undefined } => ({
    color: s.color && s.color in COLORS ? (s.color as ColorId) : undefined,
  }),
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { name: p.name.ar, desc: p.description.ar };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Linen Line` },
          { name: "description", content: loaderData.desc },
          { property: "og:title", content: `${loaderData.name} — Linen Line` },
          { property: "og:description", content: loaderData.desc },
        ]
      : [{ title: "غير متوفر — Linen Line" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const p = getProduct(slug)!;
  const { t, b, addToCart } = useStore();
  const color = search.color;
  const [size, setSize] = useState<string>();
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [msg, setMsg] = useState("");
  const shown = p.colors.find((c) => c.id === (color ?? p.colors[0]!.id))!;
  useEffect(() => setIdx(0), [color]);
  const img = shown.images[Math.min(idx, shown.images.length - 1)]!;
  const ready = !!color && !!size;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
      <Link to="/collection" className="text-sm text-muted-foreground hover:text-foreground">{t("backToCollection")}</Link>
      <div className="mt-6 grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-3 md:grid-cols-[80px_1fr]">
          <div className="order-2 flex gap-2 md:order-1 md:flex-col">
            {shown.images.map((im, i) => (
              <button key={im.src} onClick={() => setIdx(i)} aria-label={b(im.alt)} className={`w-20 border ${i === idx ? "border-foreground" : "border-transparent"}`}>
                <img src={im.src} alt="" className="aspect-[3/4] w-full object-cover" />
              </button>
            ))}
          </div>
          <button onClick={() => setZoom(true)} aria-label={t("zoom")} className="order-1 cursor-zoom-in bg-muted md:order-2">
            <img key={img.src} src={img.src} alt={b(img.alt)} className="fade-up aspect-[3/4] w-full object-cover" />
          </button>
        </div>

        <div className="md:sticky md:top-24 md:self-start">
          <h1 className="font-display text-3xl md:text-4xl">{b(p.name)}</h1>
          <p className="mt-3 text-lg">{p.price != null ? `${p.price} ${p.currency ?? ""}` : t("priceOnRequest")}</p>
          <p className="mt-6 leading-8 text-muted-foreground">{b(p.description)}</p>

          <fieldset className="mt-8 border-t pt-6">
            <legend className="text-sm">{t("color")}: <span className="text-muted-foreground">{color ? b(COLORS[color].name) : t("chooseColor")}</span></legend>
            <div className="mt-4 flex gap-4">
              {p.colors.map((c) => (
                <Swatch key={c.id} id={c.id} active={color === c.id} label={b(COLORS[c.id].name)} onClick={() => nav({ search: { color: c.id }, replace: true })} />
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="flex w-full justify-between text-sm">
              <span>{t("size")}: <span className="text-muted-foreground">{size ?? t("chooseSize")}</span></span>
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} aria-pressed={size === s} className={`h-11 min-w-14 border px-3 font-latin ${size === s ? "border-foreground bg-foreground text-background" : "hover:border-foreground"}`}>{s}</button>
              ))}
            </div>
            {p.sizesArePlaceholder && <p className="mt-3 text-xs text-accent">{t("placeholderSizes")}</p>}
            <Link to="/size-guide" className="mt-2 inline-block text-xs underline underline-offset-4">{t("sizeGuide")}</Link>
          </fieldset>

          <p className="mt-6 text-sm text-muted-foreground">{t("availability")}</p>

          <div className="mt-6 flex gap-2">
            <button
              disabled={!ready}
              onClick={() => { if (color && size) { addToCart({ slug: p.slug, color, size }); setMsg(t("added")); setTimeout(() => setMsg(""), 2500); } }}
              className="btn btn-solid flex-1"
            >
              {ready ? t("addToCart") : t("selectOptions")}
            </button>
          </div>
          <p role="status" className="mt-3 h-5 text-sm text-accent">{msg && <>{msg} — <Link to="/cart" className="underline">{t("cart")}</Link></>}</p>
          <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm underline underline-offset-4">
            <Instagram size={15} /> {t("askInstagram")}
          </a>
        </div>
      </div>

      {zoom && (
        <div role="dialog" aria-modal className="fixed inset-0 z-50 overflow-auto bg-background" onClick={() => setZoom(false)}>
          <button aria-label={t("close")} className="fixed top-4 end-4 z-10 grid h-10 w-10 place-items-center bg-background"><X /></button>
          <img src={img.src} alt={b(img.alt)} className="mx-auto min-h-full w-auto max-w-none md:max-w-full" style={{ height: "160vh" }} />
        </div>
      )}
    </div>
  );
}
