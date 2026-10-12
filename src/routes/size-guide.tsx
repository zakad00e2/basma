import { createFileRoute } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { BRAND } from "@/data/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/size-guide")({
  head: () => ({
    meta: [
      { title: "دليل المقاسات — Linen Line" },
      { name: "description", content: "دليل مقاسات عبايات Linen Line." },
      { property: "og:title", content: "دليل المقاسات — Linen Line" },
      { property: "og:description", content: "دليل مقاسات عبايات Linen Line." },
    ],
  }),
  component: SizeGuide,
});

function SizeGuide() {
  const { t } = useStore();
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 md:px-8">
      <h1 className="font-display text-4xl">{t("sizeGuide")}</h1>
      <p className="eyebrow mt-6">{t("pending")}</p>
      <p className="mt-4 leading-8 text-muted-foreground">{t("sizeGuidePending")}</p>
      <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="btn btn-line mt-8"><Instagram size={16} /> {t("askInstagram")}</a>
    </div>
  );
}
