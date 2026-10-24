import { defineConfig } from "vite-plus";

export default defineConfig({
  // `vp dev` serves the demo page in src/index.html.
  root: "src",
  pack: {
    entry: { index: "src/index.ts", style: "src/tailwind.css" },
    format: "esm",
    platform: "browser",
    dts: true,
    sourcemap: true,
    fixedExtension: false,
    css: {
      // Tailwind runs through PostCSS (.postcssrc.json).
      transformer: "postcss",
      fileName: "index.css",
      minify: true,
      // Lower CSS nesting for the browsers Tailwind v4 supports.
      target: ["chrome111", "edge111", "firefox128", "safari16.4"],
    },
  },
});
