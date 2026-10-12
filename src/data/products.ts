// Product catalog. Edit this file to update products — no admin panel yet.
// `price: null` means no confirmed price: the UI shows "price on request".
// Sizes marked `isPlaceholder` are DEMO data until real sizes are provided.
export type ColorId = "black" | "navy" | "brown";
export type Bi = { ar: string; en: string };

export const COLORS: Record<ColorId, { name: Bi; swatch: string }> = {
  black: { name: { ar: "أسود", en: "Black" }, swatch: "bg-swatch-black" },
  navy: { name: { ar: "كحلي", en: "Navy" }, swatch: "bg-swatch-navy" },
  brown: { name: { ar: "بني", en: "Brown" }, swatch: "bg-swatch-brown" },
};

export type Product = {
  slug: string;
  name: Bi;
  description: Bi;
  price: number | null;
  currency: string | null;
  sizes: string[];
  sizesArePlaceholder: boolean;
  colors: { id: ColorId; images: { src: string; alt: Bi }[] }[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "linen-line-abaya",
    name: { ar: "عباية لاين", en: "Line Abaya" },
    description: {
      ar: "عباية بقصّة فضفاضة وانسيابية، بأكمام مزيّنة بمثلثات صغيرة ولمسة حمراء عند الطرف، مع ملصق Linen Line على الكم.",
      en: "A loose, flowing abaya with small triangles on the sleeves, a red touch at the cuff and the Linen Line label.",
    },
    price: null,
    currency: null,
    sizes: ["S", "M", "L", "XL"],
    sizesArePlaceholder: true,
    colors: [
      {
        id: "black",
        images: [
          { src: "/images/black-street.jpg", alt: { ar: "عباية سوداء بقصّة طويلة بين الركام", en: "Full-length black abaya among the rubble" } },
          { src: "/images/black-street.jpg", alt: { ar: "عباية سوداء مع حقيبة", en: "Black abaya with a handbag" } },
          { src: "/images/black-detail.jpg", alt: { ar: "تفاصيل كم العباية السوداء", en: "Black abaya sleeve detail" } },
          { src: "/images/black-bag.jpg", alt: { ar: "كم العباية السوداء مع ملصق Linen Line", en: "Black abaya cuff with the Linen Line label" } },
        ],
      },
      {
        id: "navy",
        images: [
          { src: "/images/navy-profile.jpg", alt: { ar: "عباية كحلية من الجانب", en: "Navy abaya, side view" } },
          { src: "/images/navy-portrait.jpg", alt: { ar: "عباية كحلية مع حجاب", en: "Navy abaya with hijab" } },
          { src: "/images/navy-sleeve.jpg", alt: { ar: "تفاصيل كم العباية الكحلية", en: "Navy abaya sleeve detail" } },
        ],
      },
      {
        id: "brown",
        images: [
          { src: "/images/brown-portrait.jpg", alt: { ar: "عباية بنية أمام سجادة حمراء", en: "Brown abaya in front of a red carpet" } },
          { src: "/images/brown-profile.jpg", alt: { ar: "عباية بنية من الجانب", en: "Brown abaya, side view" } },
          { src: "/images/brown-sleeve.jpg", alt: { ar: "تفاصيل كم العباية البنية", en: "Brown abaya sleeve detail" } },
        ],
      },
    ],
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const BRAND = {
  instagram: "https://www.instagram.com/linenn.line/",
  instagramHandle: "@linenn.line",
  whatsapp: "https://wa.me/message/I5RYRAHVFZJ4J1",
  hours: { ar: "من 3 عصرًا حتى 11 مساءً بتوقيت غزة", en: "3 PM – 11 PM, Gaza time" },
  location: { ar: "غزة، فلسطين", en: "Gaza, Palestine" },
  tagline: { ar: "صُمم في غزة، ليُلبسَ في العالم", en: "Designed in Gaza, worn by the world." },
};
