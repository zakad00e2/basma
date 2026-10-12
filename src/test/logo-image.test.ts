import { describe, expect, it } from "vitest";

import logo from "@/assets/logo.png.asset.json";

describe("brand logo", () => {
  it("uses the locally supplied logo image", () => {
    expect(logo.url).toBe("/logo.png");
  });
});
