import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry", ...devices["Desktop Chrome"], channel: "chrome" },
  webServer: { command: "npm run dev", url: "http://localhost:3000/api/health", reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
