import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    // AppleDouble metadata files macOS scatters on exFAT volumes ("._foo.test.ts")
    // match the include glob but are not parseable source.
    exclude: ["node_modules/**", ".next/**", "**/._*"],
  },
});
