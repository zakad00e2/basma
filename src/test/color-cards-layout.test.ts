import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

describe("shop by color cards", () => {
  it("stacks cards into one full-width column on small screens", async () => {
    const page = await readFile(path.join(projectRoot, "src/routes/index.tsx"), "utf8");

    expect(page).toContain('className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6"');
  });
});
