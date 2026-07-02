import { defineConfig, devices } from "@playwright/test";
import fs from "fs";
import path from "path";
import { getEnvironment } from "./shared/config/environments";

// Explicitly load .env so env vars are available regardless of how playwright is
// invoked (yarn script, direct CLI, VS Code extension, CI, etc.).
// Existing process.env values (e.g. from CI) always take precedence.
const dotEnvFile = path.join(__dirname, ".env");
if (fs.existsSync(dotEnvFile)) {
  for (const line of fs.readFileSync(dotEnvFile, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const raw = trimmed.slice(eq + 1).trim();
    const value = raw.replace(/^(["'])(.*)\1$/, "$2"); // strip surrounding quotes
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

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
      name: "demo-video-app",
      testDir: "./apps/demo-video-app/tests",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: env.demoVideoApp.baseUrl,
      },
    },
  ],
});
