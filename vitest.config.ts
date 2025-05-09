import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

export default defineConfig({
  plugins: [],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["./src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: ["./src/tests/e2e/**/*", "./node_modules/**/*"],
    setupFiles: ["./src/tests/setup/vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov", "json"],
      exclude: ["node_modules/**", ".astro/**", "**/*.d.ts", "**/index.ts", "**/types.ts", "src/env.d.ts"],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 80,
        statements: 80,
      },
    },
    reporters: ["default", "html"],
    watch: false,
    root: fileURLToPath(new URL("./", import.meta.url)),
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
