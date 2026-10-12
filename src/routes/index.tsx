import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { BRAND, COLORS, PRODUCTS } from "@/data/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/Layout";
import hero from "@/assets/hero-black.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Linen Line — صُمم في غزة، ليُلبسَ في العالم" },
      { name: "description", content: "عبايات Linen Line بقصّات فضفاضة وتفاصيل هندسية. الطلب عبر إنستغرام داخل غزة." },
      { property: "og:title", content: "Linen Line — صُمم في غزة، ليُلبسَ في العالم" },
      { property: "og:description", content: "عبايات Linen Line بقصّات فضفاضة وتفاصيل هندسية." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, b } = useStore();
  const p = PRODUCTS[0]!;
  const navyImages = p.colors.find((color) => color.id === "navy")!.images;
  return (
    <>
      <section className="w-full overflow-hidden md:relative md:h-[var(--hero-h)]">
        <img src={hero.url} alt={t("heroAlt")} className="hero-zoom h-[var(--hero-h)] min-h-[360px] w-full object-cover object-[62%_18%] md:absolute md:inset-0 md:h-full md:min-h-0 md:object-[58%_25%]" />
        <div className="mx-auto flex max-w-7xl px-4 py-10 md:h-full md:items-center md:justify-end md:px-8 md:pb-0 md:pe-16">
          <div className="max-w-sm fade-up md:max-w-[340px] md:bg-background/90 md:p-8">
            <span className="eyebrow flex items-center gap-2"><span className="tri" /> {b(BRAND.location)}</span>
            <h1 className="mt-5 font-display text-3xl leading-[1.4] md:text-5xl">{b(BRAND.tagline)}</h1>
            <div className="mt-8"><Link to="/collection" className="btn btn-solid">{t("discover")}</Link></div>
          </div>
        </div>
      </section>

      <section data-reveal className="mx-auto max-w-7xl px-4 pt-24 md:px-8">
        <div className="flex items-end justify-between border-b pb-4">
          <h2 className="font-display text-3xl">{t("currentCollection")}</h2>
          <Link to="/collection" className="text-sm underline-offset-4 hover:underline">{t("collection")} ←</Link>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {p.colors.map((c) => <ProductCard key={c.id} p={p} color={c.id} />)}
        </div>
      </section>

      <section data-reveal className="mx-auto mt-28 grid max-w-7xl gap-6 px-4 md:grid-cols-12 md:px-8">
        <img src={navyImages[0]!.src} alt={b(navyImages[0]!.alt)} loading="lazy" className="aspect-[3/4] w-full object-cover md:col-span-5" />
        <div className="flex flex-col justify-between gap-8 md:col-span-7">
          <div className="max-w-md pt-4">
            <span className="flex gap-1"><span className="tri" /><span className="tri bg-foreground" /><span className="tri bg-foreground" /><span className="tri bg-foreground" /></span>
            <h2 className="mt-6 font-display text-3xl md:text-4xl">{t("detailsTitle")}</h2>
            <p className="mt-4 leading-8 text-muted-foreground">{t("detailsText")}</p>
          </div>
          <img src={navyImages[2]!.src} alt={b(navyImages[2]!.alt)} loading="lazy" className="aspect-[4/3] w-full object-cover" />
        </div>
      </section>

      <section data-reveal className="mx-auto mt-28 max-w-7xl px-4 md:px-8">
        <h2 className="border-b pb-4 font-display text-3xl">{t("shopByColor")}</h2>
        <div className="mt-8 grid grid-cols-3 gap-3 md:gap-6">
          {p.colors.map((c) => (
            <Link key={c.id} to="/collection" search={{ color: c.id }} className="group relative block overflow-hidden">
              <img src={c.images[c.images.length - 1]!.src} alt="" loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 bg-background/90 py-3 text-center text-sm">{b(COLORS[c.id].name)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section data-reveal className="mx-auto mt-28 grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:px-8">
        <div>
          <p className="eyebrow">Linen Line</p>
          <p className="mt-4 font-display text-2xl leading-[1.7]">{t("aboutShort")}</p>
          <Link to="/about" className="mt-6 inline-block text-sm underline underline-offset-4">{t("about")}</Link>
        </div>
        <div className="border-t pt-8 md:border-t-0 md:border-s md:ps-12 md:pt-0">
          <h2 className="font-display text-2xl">{t("howToOrder")}</h2>
          <ol className="mt-6 space-y-4 text-sm leading-7">
            {(["orderStep1", "orderStep2", "orderStep3"] as const).map((k, i) => (
              <li key={k} className="flex gap-4"><span className="font-latin text-lg text-accent">0{i + 1}</span>{t(k)}</li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted-foreground">{t("orderAvailability")} {t("replyHours")}: {b(BRAND.hours)}.</p>
          <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="btn btn-line mt-6"><Instagram size={16} /> <span dir="ltr">{BRAND.instagramHandle}</span></a>
        </div>
      </section>
    </>
  );
}
