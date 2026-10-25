import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    // Mirrors the previous Prettier config.
    trailingComma: "all",
    printWidth: 80,
    sortPackageJson: false,
    ignorePatterns: [
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.docusaurus/**",
      "packages/*/docs/**",
      "pnpm-lock.yaml",
    ],
    overrides: [
      {
        // Was prettier-plugin-organize-imports + prettier-plugin-tailwindcss.
        files: ["packages/toranpu-react/**"],
        options: {
          sortImports: { newlinesBetween: false },
          sortTailwindcss: true,
        },
      },
    ],
  },
  lint: {
    ignorePatterns: [
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.docusaurus/**",
    ],
    plugins: ["typescript", "oxc", "unicorn", "react"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      // Was eslint-plugin-react-hooks (recommended) in toranpu-react.
      "react/rules-of-hooks": "error",
      "react/exhaustive-deps": "warn",
    },
  },
  run: {
    cache: true,
  },
});
