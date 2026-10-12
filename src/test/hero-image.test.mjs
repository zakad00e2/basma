import assert from "node:assert/strict";
import test from "node:test";

import hero from "../assets/hero-black.jpg.asset.json" with { type: "json" };

test("hero image uses the locally supplied replacement", () => {
  assert.equal(hero.url, "/hero-main.jpg");
});
