import { createFileRoute } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { BRAND } from "@/data/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "التواصل وطريقة الطلب — Linen Line" },
      { name: "description", content: "اطلبي عبر رسائل إنستغرام داخل غزة. ساعات الرد من 3 عصرًا حتى 11 مساءً." },
      { property: "og:title", content: "التواصل وطريقة الطلب — Linen Line" },
      { property: "og:description", content: "اطلبي عبر رسائل إنستغرام داخل غزة." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t, b } = useStore();
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 md:px-8">
      <h1 className="font-display text-4xl">{t("contactTitle")}</h1>
      <ol className="mt-10 space-y-6 border-y py-8">
        {(["orderStep1", "orderStep2", "orderStep3"] as const).map((k, i) => (
          <li key={k} className="flex gap-5"><span className="font-latin text-2xl text-accent">0{i + 1}</span><span className="pt-1 leading-7">{t(k)}</span></li>
        ))}
      </ol>
      <dl className="mt-8 grid gap-6 sm:grid-cols-3 text-sm">
        <div><dt className="text-muted-foreground">Instagram</dt><dd className="mt-1" dir="ltr">{BRAND.instagramHandle}</dd></div>
        <div><dt className="text-muted-foreground">{t("replyHours")}</dt><dd className="mt-1">{b(BRAND.hours)}</dd></div>
        <div><dt className="text-muted-foreground">{t("location")}</dt><dd className="mt-1">{b(BRAND.location)}</dd></div>
      </dl>
      <p className="mt-8 text-sm text-accent">{t("orderAvailability")}</p>
      <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="btn btn-solid mt-6"><Instagram size={16} /> {t("askInstagram")}</a>
    </div>
  );
}
