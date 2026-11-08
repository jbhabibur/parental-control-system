const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  globalIgnores(["dist/*", "src/no-app/**", "src/ok-components/**"]),
  expoConfig,
]);
