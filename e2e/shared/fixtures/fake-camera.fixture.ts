import { test as base, Page } from "@playwright/test";

declare global {
  interface Window {
    __switchFakeCamera: (url: string) => Promise<void>;
  }
}

export const FAKE_VIDEO_URLS = {
  SEDAN_EXTERIOR:
    "https://storage.googleapis.com/monk-sight-images/e2e-assets/e2e-exterior.mp4",
  SEDAN_INTERIOR:
    "https://storage.googleapis.com/monk-sight-images/e2e-assets/e2e-interior.mp4",
};

function overrideScriptFn(initialUrl: string): void {
  const video = document.createElement("video");
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = "anonymous";
  video.src = initialUrl;

  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");

  let animating = false;
  function drawLoop() {
    if (ctx && video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(drawLoop);
  }

  video.addEventListener("canplay", function () {
    if (!animating) {
      animating = true;
      drawLoop();
    }
    video.play().catch(function () {});
  });

  video.load();

  // navigator.mediaDevices may not be initialised yet when addInitScript fires
  // early in the page lifecycle. __switchFakeCamera is always assigned so
  // mid-test switches work regardless.
  try {
    const md = navigator.mediaDevices;
    if (md && md.getUserMedia) {
      const original = md.getUserMedia.bind(md);
      md.getUserMedia = async function (constraints) {
        if (constraints && constraints.video) {
          return canvas.captureStream(30);
        }
        return original(constraints);
      };
    }
  } catch (_) {}

  window.__switchFakeCamera = function (url: string): Promise<void> {
    return new Promise((resolve) => {
      video.addEventListener("canplay", () => resolve(), { once: true });
      video.src = url;
      video.load();
    });
  };
}

/** Interface for the auto-setup fixture exposed by fakeCameraFixtures. */
export interface FakeCameraFixture {
  setupFakeCamera: void;
}

/**
 * Standalone helper — call from anywhere you have `page`.
 * The fake camera must have been initialised by the setupFakeCamera auto-fixture first.
 * Awaits the new video source being ready (canplay) before resolving.
 */
export async function switchFakeCamera(page: Page, url: string): Promise<void> {
  await page.evaluate((u: string) => {
    return (
      window as unknown as {
        __switchFakeCamera: (url: string) => Promise<void>;
      }
    ).__switchFakeCamera(u);
  }, url);
}

export const fakeCameraFixtures = {
  /**
   * Auto fixture: injects the getUserMedia override for every test that uses
   * this fixture set, without needing to be explicitly destructured.
   * - addInitScript covers full-page navigations that happen after setup.
   * - page.evaluate covers the page that is already loaded (e.g. after the
   *   authenticatedPage fixture has already called page.goto()).
   */
  setupFakeCamera: [
    async ({ page }: { page: Page }, use: () => Promise<void>) => {
      // GCS public buckets don't emit CORS headers
      await page.route("https://storage.googleapis.com/**", async (route) => {
        const response = await route.fetch();
        await route.fulfill({
          response,
          headers: {
            ...response.headers(),
            "Access-Control-Allow-Origin": "*",
          },
        });
      });
      await page.addInitScript(
        overrideScriptFn,
        FAKE_VIDEO_URLS.SEDAN_EXTERIOR
      );
      await page
        .evaluate(overrideScriptFn, FAKE_VIDEO_URLS.SEDAN_EXTERIOR)
        .catch(() => {});
      await use();
    },
    { auto: true },
  ] as [
    ({ page }: { page: Page }, use: () => Promise<void>) => Promise<void>,
    { auto: boolean }
  ],
};

// Standalone test object, useful when not composing into another chain
export const fakeCameraTest = base.extend<FakeCameraFixture>(
  fakeCameraFixtures as Parameters<typeof base.extend>[0]
);
