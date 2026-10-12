import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { COLORS, PRODUCTS, type ColorId } from "@/data/products";
import { useStore } from "@/lib/store";
import { ProductCard, Swatch } from "@/components/Layout";

type Search = { color?: ColorId | undefined; q?: string | undefined; sort?: "name" | undefined };

export const Route = createFileRoute("/collection")({
  validateSearch: (s: any): Search => ({
    color: s.color && s.color in COLORS ? (s.color as ColorId) : undefined,
    q: typeof s.q === "string" && s.q ? s.q : undefined,
    sort: s.sort === "name" ? "name" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "المجموعة — Linen Line" },
      { name: "description", content: "تصفحي عبايات Linen Line بالأسود والكحلي والبني." },
      { property: "og:title", content: "المجموعة — Linen Line" },
      { property: "og:description", content: "تصفحي عبايات Linen Line بالأسود والكحلي والبني." },
    ],
  }),
  component: Collection,
});

function Collection() {
  const { color, q, sort } = Route.useSearch();
  const nav = useNavigate({ from: "/collection" });
  const { t, b } = useStore();
  const set = (s: Partial<Search>) => nav({ search: (p) => ({ ...p, ...s }), replace: true });

  let items = PRODUCTS.flatMap((p) => p.colors.map((c) => ({ p, color: c.id })));
  if (color) items = items.filter((i) => i.color === color);
  if (q) {
    const n = q.toLowerCase();
    items = items.filter(({ p, color }) =>
      [p.name.ar, p.name.en, p.description.ar, p.description.en, COLORS[color].name.ar, COLORS[color].name.en].some((s) => s.toLowerCase().includes(n)),
    );
  }
  if (sort === "name") items = [...items].sort((a, z) => b(COLORS[a.color].name).localeCompare(b(COLORS[z.color].name)));

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
      <h1 className="font-display text-4xl">{t("collection")}</h1>
      <div className="mt-8 grid gap-4 border-y py-4 md:grid-cols-[1fr_auto_auto] md:items-center">
        <input
          type="search"
          defaultValue={q}
          onChange={(e) => set({ q: e.target.value || undefined })}
          placeholder={t("searchPlaceholder")}
          aria-label={t("search")}
          className="h-11 border-b bg-transparent px-1 outline-none focus:border-foreground"
        />
        <div className="flex items-center gap-3">
          <button onClick={() => set({ color: undefined })} className={`text-sm ${!color ? "text-accent" : ""}`}>{t("allColors")}</button>
          {(Object.keys(COLORS) as ColorId[]).map((id) => (
            <Swatch key={id} id={id} active={color === id} label={b(COLORS[id].name)} onClick={() => set({ color: color === id ? undefined : id })} />
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          {t("sort")}
          <select value={sort ?? ""} onChange={(e) => set({ sort: e.target.value === "name" ? "name" : undefined })} className="h-10 border bg-background px-2">
            <option value="">{t("sortDefault")}</option>
            <option value="name">{t("sortName")}</option>
          </select>
        </label>
      </div>
      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">{items.length} {t("results")}</p>
      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-xl">{t("noResults")}</p>
          <button onClick={() => nav({ search: {} })} className="btn btn-line mt-6">{t("clearFilters")}</button>
        </div>
      ) : (
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => <ProductCard key={i.p.slug + i.color} p={i.p} color={i.color} />)}
        </div>
      )}
    </div>
  );
}
