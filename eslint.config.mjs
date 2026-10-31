import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "@next/eslint-plugin-next";

const eslintConfig = [
  nextVitals.configs["core-web-vitals"],
  globalIgnores([".next/**", "node_modules/**", "out/**", "build/**", "next-env.d.ts"]),
];

export default defineConfig(eslintConfig);
