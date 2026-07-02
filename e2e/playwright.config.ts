import { defineConfig, devices } from "@playwright/test";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, ".env") });

import { getEnvironment } from "./shared/config/environments";

const env = getEnvironment();

const fakeVideoPath =
  process.env["FAKE_VIDEO_PATH"] ??
  path.join(__dirname, "assets", "fake-camera.y4m");

const chromeArgs = [
  "--use-fake-ui-for-media-stream",
  "--use-fake-device-for-media-stream",
  ...(fs.existsSync(fakeVideoPath)
    ? [`--use-file-for-fake-video-capture=${path.resolve(fakeVideoPath)}`]
    : []),
];

export default defineConfig({
  fullyParallel: false,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: 1,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: chromeArgs,
    },
  },
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
