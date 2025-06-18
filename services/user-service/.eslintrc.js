module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // TypeScript使用時
    "prettier", // Prettier連携
  ],
  parser: "@typescript-eslint/parser", // TS用パーサー
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-console": "warn", // console.log警告
    "consistent-return": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};
