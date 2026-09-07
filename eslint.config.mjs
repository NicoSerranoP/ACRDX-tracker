import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import { configs } from "eslint-config-airbnb-extended/legacy";
import prettier from "eslint-plugin-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const currentFilePath = fileURLToPath(import.meta.url);
const prettierConfig = readFileSync(resolve(currentFilePath, "../.prettierrc.json"), "utf8");
const prettierOptions = JSON.parse(prettierConfig);

export const baseConfig = [
  ...configs.base.recommended,
  ...configs.base.typescript,
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      prettier,
    },
    rules: {
      "no-console": "error",
      "prettier/prettier": ["error", prettierOptions],
      "complexity": ["error", { max: 10 }],
      "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true, skipComments: true }],
      "max-params": ["error", { max: 3 }],
      "no-unused-vars": "error",
      "no-unused-expressions": "error",
      "no-unreachable": "error",
      "prefer-const": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { fixStyle: "inline-type-imports", prefer: "type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": [
        "error",
        {
          builtinGlobals: true,
          allow: ["location", "event", "history", "name", "status", "Option", "test", "expect", "jest"],
        },
      ],
    },
  },
  {
    ignores: ["**/dist/**", "**/build/**", "**/.react-router/**", "**/eslint.config.mjs", "**/commitlint.config.mjs"],
  },
];

export default defineConfig(...baseConfig);
