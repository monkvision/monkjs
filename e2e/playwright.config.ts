import { defineConfig, devices } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, ".env") });

import { getEnvironment } from "./shared/config/environments";

const env = getEnvironment();

const chromeArgs = [
  "--use-fake-ui-for-media-stream",
  "--use-fake-device-for-media-stream",
];

export default defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: 2,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: chromeArgs,
    },
  },
  webServer: [
    {
      command: "yarn start:e2e",
      cwd: path.resolve(__dirname, "../apps/demo-app"),
      url: env.demoApp.baseUrl,
      reuseExistingServer: !process.env["CI"],
      timeout: 180_000,
      ignoreHTTPSErrors: true,
    },
    {
      command: "yarn start",
      cwd: path.resolve(__dirname, "../apps/demo-app-video"),
      url: env.demoVideoApp.baseUrl,
      reuseExistingServer: !process.env["CI"],
      timeout: 180_000,
      ignoreHTTPSErrors: true,
    },
  ],
  projects: [
    {
      name: "demo-app",
      testDir: "./apps/demo-app/tests",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: env.demoApp.baseUrl,
      },
    },
    {
      name: "demo-app-video",
      testDir: "./apps/demo-app-video/tests",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: env.demoVideoApp.baseUrl,
      },
    },
  ],
});
