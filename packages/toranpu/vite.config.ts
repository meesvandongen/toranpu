import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/index.ts"],
    format: "esm",
    dts: true,
    sourcemap: true,
    clean: true,
    // Drop the in-source tests (`if (import.meta.vitest)`) from the build.
    define: { "import.meta.vitest": "undefined" },
  },
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    globals: true,
    includeSource: ["src/**/*.ts"],
  },
});
