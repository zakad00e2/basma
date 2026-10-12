import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/data/products";
import { useStore } from "@/lib/store";
import { PRODUCTS } from "@/data/products";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن Linen Line" },
      { name: "description", content: "Linen Line علامة عبايات من غزة، فلسطين." },
      { property: "og:title", content: "عن Linen Line" },
      { property: "og:description", content: "Linen Line علامة عبايات من غزة، فلسطين." },
    ],
  }),
  component: About,
});

function About() {
  const { t, b } = useStore();
  return (
    <div className="mx-auto max-w-5xl px-4 pt-10 md:px-8">
      <h1 className="font-display text-4xl">{t("aboutTitle")}</h1>
      <img src={PRODUCTS[0]!.colors[0]!.images[0]!.src} alt="" className="mt-10 aspect-[16/9] w-full object-cover" />
      <div className="mx-auto mt-12 max-w-2xl text-center">
        <p className="font-display text-3xl leading-[1.6]">{b(BRAND.tagline)}</p>
        <p className="mt-6 leading-8 text-muted-foreground">{t("aboutShort")}</p>
        <p className="mt-4 text-sm">{t("location")}: {b(BRAND.location)}</p>
      </div>
    </div>
  );
}
