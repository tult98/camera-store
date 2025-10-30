module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "no-unused-vars": "off" // Turn off the base rule as it can report incorrect errors
  }
};