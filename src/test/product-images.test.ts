import { describe, expect, it } from "vitest";

import { PRODUCTS } from "@/data/products";

describe("product images", () => {
  it("uses local image paths for every catalog image", () => {
    const imageSources = PRODUCTS.flatMap((product) =>
      product.colors.flatMap((color) => color.images.map((image) => image.src)),
    );

    expect(imageSources).not.toHaveLength(0);
    expect(imageSources.every((source) => source.startsWith("/images/"))).toBe(true);
  });
});
