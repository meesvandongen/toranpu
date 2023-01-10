import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: "index",
    },
  },
  define: {
    "import.meta.vitest": "undefined",
  },
  plugins: [dts()],
});
