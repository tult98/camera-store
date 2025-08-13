module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "no-unused-vars": "off" // Turn off the base rule as it can report incorrect errors
  }
};