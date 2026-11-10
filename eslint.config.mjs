import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // .github/scripts/plesk-launcher.js is a CommonJS startup file published as-is to the server.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "tools/**", ".github/scripts/**"]),
]);

export default eslintConfig;
