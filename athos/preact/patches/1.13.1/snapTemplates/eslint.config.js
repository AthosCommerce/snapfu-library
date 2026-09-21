// DO NOT EDIT - THIS FILE CAN/WILL BE REPLACED!!!
// ***********************************************

const tsParser = require("@typescript-eslint/parser");
const snapConfigPlugin = require("@athoscommerce/snap-preact/eslintplugin");

module.exports = [
  {
    ignores: [
      "coverage/**",
      "dist/**",
      "**/test/**",
      "**/__test__/**",
      "**/tests/**",
      "**/__tests__/**",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "snap-config": snapConfigPlugin,
    },
    rules: {
      "no-debugger": "error",
      "no-console": "error",
      "no-magic-numbers": "off",
      "snap-config/validate-config": "error",
    },
  },
  {
    // typed linting for the Snap Templates config: lets validate-config resolve types and squiggle invalid override selectors and props inline
    files: ["src/index.ts", "src/index.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
  },
];