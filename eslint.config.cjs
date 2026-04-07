"use strict";

const { FlatCompat } = require("@eslint/eslintrc");
const { globalIgnores } = require("eslint/config");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "eslint.config.cjs",
  ]),
];

module.exports = eslintConfig;
