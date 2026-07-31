import { defineConfig } from "vite-plus"

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["**/node_modules/**", "**/dist/**", "**/build/**"],
    ignoreFiles: ["./src/payload.config.ts"],
    ignoreDirs: ["./src/db/migrations"],
    parser: "typescript",
    semi: false,
    singleQuote: false,
    trailingComma: "all",
    printWidth: 90,
    tabWidth: 2,
    arrowParens: "always",
    insertFinalNewline: true,
    singleAttributePerLine: true,
    bracketSameLine: true,
    bracketSpacing: true,
    jsxSingleQuote: false,
    embeddedLanguageFormatting: "auto",
    sortTailwindcss: true,
  },
  lint: {
    ignorePatterns: ["dist/**"],
    settings: {
      next: {
        rootDir: "./",
      },
    },
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "off",
      "typescript/no-useless-default-assignment": "off",
      "typescript/no-import-type-side-effects": "off",
      "unicorn/no-useless-fallback-in-spread": "off",
    },
    options: { typeAware: true, typeCheck: true },
  },
})
