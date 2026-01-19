import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: "jsdom",

    // Setup files
    setupFiles: ["./vitest.setup.ts"],

    // Glob patterns for test files
    include: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],

    // Exclude patterns (Vitest 4.0 simplified defaults, so we need to be explicit)
    exclude: [
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
      "**/.next/**",
      "**/out/**",
      "**/coverage/**",
    ],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        ".next/",
        "out/",
        "dist/",
        "build/",
        "coverage/",
        "**/*.config.{js,ts,mjs}",
        "**/vitest.setup.ts",
        "**/*.d.ts",
        "**/types/**",
        "**/__tests__/**",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
      ],
      thresholds: {
        lines: 95,
        functions: 100,
        branches: 90,
        statements: 95,
      },
    },

    // Global test timeout
    testTimeout: 10000,

    // Globals (vitest globals like describe, it, expect)
    globals: true,
  },

  server: {
    watch: {
      ignored: [
        "**/node_modules/**",
        "**/.next/**",
        "**/dist/**",
        "**/coverage/**",
      ],
    },
  },

  // Resolve aliases to match Next.js tsconfig paths
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
