import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const projectFile = (file: string) => path.join(projectRoot, file);

describe("platform branding", () => {
  it("does not ship third-party builder references", async () => {
    const files = [
      "AGENTS.md",
      "README.md",
      "bun.lock",
      "bunfig.toml",
      "package-lock.json",
      "package.json",
      "vite.config.ts",
      "src/routes/__root.tsx",
    ];
    const contents = await Promise.all(
      files.map(async (file) => readFile(projectFile(file), "utf8")),
    );

    expect(contents.join("\n")).not.toMatch(/l[o]vable/i);
  });
});
