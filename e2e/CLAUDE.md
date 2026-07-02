- In all interactions and commit messages, be extremely concise and sacriface grammar for the sake of concision.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About this package

`e2e/` is a **standalone package** (not a yarn workspace member). It has its own `yarn.lock` and `node_modules` but reuses the monorepo's yarn binary via `.yarnrc.yml`. You must `cd e2e && yarn install` separately before running tests.

## Commands

```bash
# Install (must run from e2e/)
yarn install          # also runs postinstall: playwright install chromium

# Run all tests
yarn test

# Run a single project
yarn test:demo-app
yarn test:demo-app-video

# Interactive UI mode (for debugging)
yarn test:ui

# Show the last HTML report
yarn report
```

To run a single spec file:

```bash
yarn playwright test apps/demo-app/tests/happy-path.spec.ts
```

## Prerequisites before running tests

The apps under test must be running **before** launching Playwright — there is no `webServer` block in `playwright.config.ts`. Start both locally:

- `demo-app` → `https://localhost:17200`
- `demo-app-video` → `https://localhost:17201`

URLs are read from `.env`. Copy `.env.example` to `.env` and fill in:

- `TEST_TOKEN` — a valid signed JWT with `monk_core_api:*` scopes for the configured `API_DOMAIN`
- `DEMO_APP_URL` / `DEMO_VIDEO_APP_URL`
- `API_DOMAIN`

## Architecture

The suite follows a strict 3-layer model enforced throughout:

```
shared/fixtures/auth.fixture.ts   ← base: navigates to ?t=<token> before each test
apps/<app>/fixtures/index.ts      ← extends auth fixture; registers all POMs as named fixtures
apps/<app>/tests/*.spec.ts        ← destructures POM fixtures, asserts with expect()
```

**Key rules:**

- Specs import `{ test, expect }` from `../fixtures`, never from `@playwright/test` directly.
- All DOM interaction (locators, clicks, waits) lives in Page Object Models — specs never call `page.locator/click/waitFor`.
- All assertions (`expect()`) live in specs — POMs never assert.

### Selectors

`BasePage` ([shared/pages/BasePage.ts](shared/pages/BasePage.ts)) provides two helpers:

- `this.locator(id)` → `data-testid` attribute (for existing selectors)
- `this.e2eLocator(id)` → `data-e2e` attribute (for new selectors — use this for any new DOM targets)

### Authentication

`buildAuthUrl()` ([shared/utils/token.ts](shared/utils/token.ts)) compresses the raw JWT with pako deflate, base64-encodes it, and appends it as `?t=<value>` to the app URL. The auth fixture runs this before every test — no login flow is needed.

### Camera & video faking

Playwright is launched with Chrome flags to fake the camera:

- `--use-fake-ui-for-media-stream` — auto-grants camera permissions
- `--use-fake-device-for-media-stream` — provides a synthetic video stream
- `--use-file-for-fake-video-capture=assets/fake-camera.y4m` — used if the file exists

For the video walkaround, `simulateWalkaround()` ([shared/utils/compass.ts](shared/utils/compass.ts)) dispatches `DeviceOrientationEvent` in-browser via `page.evaluate`. It runs ~74 steps at 540ms intervals (~40s total) to satisfy the 15s recording minimum and 270° walkaround requirement.

**Compass invariants (do not break):**
- Dispatch on both `deviceorientationabsolute` and `deviceorientation` — Chromium exposes the absolute variant and the app subscribes to it.
- Raw event `alpha` must **increase** each tick. `useDeviceOrientation` publishes `360 - event.alpha`, so hook-alpha decreases and `walkaroundPosition` grows past the 45° checkpoint guard in `useVehicleWalkaround` (positions exceeding `nextCheckpoint` are hard-rejected to 0, not clamped).
- `dispatchAlpha` awaits two `requestAnimationFrame`s after dispatching so React flushes `setAlpha` before the caller clicks record — otherwise `startWalkaround` snapshots a stale alpha and the position math is shifted.

### Parallelism

Tests run serially (`workers: 1`, `fullyParallel: false`) to avoid conflicts with shared inspection state on the API.

## Adding a new app

1. Create `apps/<new-app>/pages/` with POMs extending `BasePage`.
2. Create `apps/<new-app>/fixtures/index.ts` extending `authTest` and registering your POMs.
3. Create `apps/<new-app>/tests/` with specs importing from `../fixtures`.
4. Add a new project entry in [playwright.config.ts](playwright.config.ts) pointing at the new `testDir` and `baseURL`.
5. Add the new URL variable to [shared/config/environments.ts](shared/config/environments.ts) and `.env.example`.
