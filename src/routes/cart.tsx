import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { BRAND, COLORS, getProduct } from "@/data/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "السلة — Linen Line" },
      { name: "description", content: "راجعي سلتك وانسخي ملخص الطلب لإرساله عبر واتساب." },
      { property: "og:title", content: "السلة — Linen Line" },
      { property: "og:description", content: "راجعي سلتك وانسخي ملخص الطلب." },
    ],
  }),
  component: Cart,
});

// WhatsApp has no icon in the icon set we use, so the mark is drawn here.
function WhatsAppMark({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.14-.18.19-.3.29-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.07 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.27-.2-.57-.34M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.43 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42" />
    </svg>
  );
}

function Cart() {
  const { t, b, cart, setQty, removeItem, lang } = useStore();
  const [copied, setCopied] = useState(false);
  const rows = cart.map((i) => ({ i, p: getProduct(i.slug) })).filter((r) => r.p);
  const priced = rows.every((r) => r.p!.price != null);
  const total = rows.reduce((s, r) => s + (r.p!.price ?? 0) * r.i.qty, 0);

  const summary = [
    lang === "ar" ? "مرحبًا Linen Line، أود طلب:" : "Hello Linen Line, I'd like to order:",
    ...rows.map((r, n) => `${n + 1}. ${b(r.p!.name)} — ${t("color")}: ${b(COLORS[r.i.color].name)} — ${t("size")}: ${r.i.size} — ${t("qty")}: ${r.i.qty}`),
    priced ? `${t("total")}: ${total} ${rows[0]?.p!.currency ?? ""}` : "",
  ].filter(Boolean).join("\n");

  // The clipboard write is started before the browser switches to the chat tab,
  // with an older copy method as backup when the modern one is refused.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = summary;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
      } catch {
        setCopied(false);
      }
      document.body.removeChild(ta);
    }
    setTimeout(() => setCopied(false), 2500);
  };

  if (!rows.length)
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">{t("cart")}</h1>
        <p className="mt-6 text-muted-foreground">{t("cartEmpty")}</p>
        <Link to="/collection" className="btn btn-solid mt-8">{t("discover")}</Link>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-10 md:grid-cols-[1.4fr_1fr] md:px-8">
      <div>
        <h1 className="font-display text-4xl">{t("cart")}</h1>
        <ul className="mt-8 divide-y border-y">
          {rows.map(({ i, p }) => {
            const img = p!.colors.find((c) => c.id === i.color)!.images[0]!;
            return (
              <li key={i.slug + i.color + i.size} className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 py-6">
                <img src={img.src} alt={b(img.alt)} className="aspect-[3/4] w-full object-cover" />
                <div className="min-w-0">
                  <p className="font-display text-lg">{b(p!.name)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("color")}: {b(COLORS[i.color].name)} · {t("size")}: {i.size}</p>
                  <p className="mt-1 text-sm">{p!.price != null ? `${p!.price * i.qty} ${p!.currency ?? ""}` : t("priceOnRequest")}</p>
                  <div className="mt-4 flex items-center gap-6">
                    <div className="flex items-center border">
                      <button aria-label="-" onClick={() => setQty(i, i.qty - 1)} className="grid h-9 w-9 place-items-center"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm" aria-label={t("qty")}>{i.qty}</span>
                      <button aria-label="+" onClick={() => setQty(i, i.qty + 1)} className="grid h-9 w-9 place-items-center"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(i)} className="text-sm underline underline-offset-4 hover:text-accent">{t("remove")}</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-sm">{priced ? `${t("total")}: ${total}` : t("totalOnRequest")}</p>
      </div>

      <aside className="bg-muted p-6 md:self-start">
        <h2 className="font-display text-2xl">{t("orderSummary")}</h2>
        <pre className="mt-4 whitespace-pre-wrap border bg-background p-4 font-sans text-sm leading-7">{summary}</pre>
        <a
          href={BRAND.whatsapp}
          target="_blank"
          rel="noreferrer"
          onClick={() => { void copy(); }}
          className="btn btn-solid mt-4 w-full"
        >
          <WhatsAppMark size={16} /> {copied ? t("copied") : t("sendWhatsapp")}
        </a>
        <button onClick={() => { void copy(); }} className="btn btn-line mt-3 w-full">{copied ? t("copied") : t("copy")}</button>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">{t("cartNote")}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t("orderAvailability")} {t("replyHours")}: {b(BRAND.hours)}.</p>
      </aside>
    </div>
  );
}
