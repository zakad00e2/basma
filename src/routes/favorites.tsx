import { createFileRoute, Link } from "@tanstack/react-router";
import { getProduct, type ColorId } from "@/data/products";
import { useStore } from "@/lib/store";
import { ProductCard } from "@/components/Layout";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "المفضلة — Linen Line" },
      { name: "description", content: "العبايات التي حفظتِها في المفضلة." },
      { property: "og:title", content: "المفضلة — Linen Line" },
      { property: "og:description", content: "العبايات التي حفظتِها في المفضلة." },
    ],
  }),
  component: Favs,
});

function Favs() {
  const { t, favs } = useStore();
  const items = favs.map((k) => { const [s, c] = k.split(":"); return { p: getProduct(s ?? ""), color: c as ColorId }; }).filter((x) => x.p && x.p.colors.some((c) => c.id === x.color));
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
      <h1 className="font-display text-4xl">{t("favorites")}</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">{t("favEmpty")}</p>
          <Link to="/collection" className="btn btn-solid mt-8">{t("discover")}</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => <ProductCard key={i.p!.slug + i.color} p={i.p!} color={i.color} />)}
        </div>
      )}
    </div>
  );
}
