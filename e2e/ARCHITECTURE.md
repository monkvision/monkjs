# E2E Suite — Agent Reference

End-to-end Playwright tests for the two web demo apps in this monorepo: `demo-app` (photo capture) and `demo-app-video` (video walkaround → photo capture).
Tests run against a real preview API — **no mocking**. This file is the operating manual; read it before editing anything under `e2e/`.

---

## Layout

```
e2e/
├── apps/
│   ├── demo-app/
│   │   ├── fixtures/index.ts   # extends auth fixture with app POMs
│   │   ├── pages/              # POMs specific to demo-app
│   │   └── tests/*.spec.ts
│   └── demo-app-video/         # same shape as demo-app
├── shared/
│   ├── config/environments.ts  # typed baseUrl per app
│   ├── fixtures/auth.fixture.ts # `authenticatedPage` → navigates to ?t=<token>
│   ├── pages/                  # BasePage, GalleryPage, PhotoCapturePage (reused by both apps)
│   └── utils/                  # camera flags, compass simulation, token compression
├── playwright.config.ts        # two projects: demo-app, demo-app-video
├── .env.example                # required env vars
└── package.json                # standalone — not a yarn workspace
```

`e2e/` reuses the monorepo yarn binary via `.yarnrc.yml` but keeps its own `yarn.lock` / `node_modules`. Install with `cd e2e && yarn install`.

---

## Running

`playwright.config.ts` declares both demo apps in a `webServer` array with `reuseExistingServer: !process.env.CI`. Devs running an app locally are detected and reused; if nothing is bound to the port, Playwright cold-starts the app via `yarn start` from the app's directory. CI (`CI=true`) always cold-starts.

```bash
yarn test                # both projects (cold-starts apps if not already running)
yarn test:demo-app
yarn test:demo-app-video
yarn test:ui             # Playwright UI mode
yarn report              # open the last HTML report
```

`workers: 2`, `fullyParallel: false`, `retries: 2` on CI. The two projects (`demo-app`, `demo-app-video`) run in parallel across workers. Tests within each project run serially — they share API state (the same inspection) so order matters inside a project.

---

## Environment variables

| Variable             | Required | Default                 | Notes                                                                                                                     |
| -------------------- | -------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `TEST_TOKEN`         | yes      | —                       | Raw JWT; compressed into `?t=` query param                                                                                |
| `DEMO_APP_URL`       | no       | `https://localhost:17200` | Probed by Playwright `webServer.url`; must match `PORT` in `apps/demo-app/.env-cmdrc.json` `local` profile              |
| `DEMO_VIDEO_APP_URL` | no       | `https://localhost:17201` | Probed by Playwright `webServer.url`; must match `PORT` in `apps/demo-app-video/.env-cmdrc.json` `e2e` profile        |
| `FAKE_VIDEO_PATH`    | no       | —                       | Absolute path to a `.y4m` file for the fake camera. If absent, Chromium uses its default test pattern (tests still pass). |

`API_DOMAIN` in `.env.example` is consumed by the demo apps themselves, not by the test runner.

`playwright.config.ts` parses `.env` itself using `dotenv` package.

---

## How a test wires together

Three layers, top-down:

1. **`shared/fixtures/auth.fixture.ts`** — defines `authenticatedPage`. Builds an auth URL via `shared/utils/token.ts::buildAuthUrl(baseURL)` and `page.goto`s it. The yielded value is unused; the fixture exists for its navigation side effect.
2. **`apps/<app>/fixtures/index.ts`** — extends the auth fixture and exposes every POM as its own fixture (`new XxxPage(page)` per fixture).
3. **Spec files** — import `{ test, expect }` from **`../fixtures`** (never from `@playwright/test`), then destructure the POMs they need.

Canonical example (`apps/demo-app/tests/happy-path.spec.ts`):

```typescript
import { test, expect } from "../fixtures";

test("creates inspection, captures all sights, reviews gallery and submits", async ({
  authenticatedPage,
  createInspectionPage,
  vehicleTypeSelectionPage,
  photoCaptureTutorialPage,
  photoCapturePage,
  galleryPage,
}) => {
  await createInspectionPage.waitForInspectionCreated();
  await vehicleTypeSelectionPage.confirmDefaultVehicleType();
  await photoCaptureTutorialPage.completeTutorial();
  await photoCapturePage.captureAllSights();
  await galleryPage.waitForGallery();
  expect(await galleryPage.imageCards.count()).toBeGreaterThan(0);
  await galleryPage.submit();
});
```

---

## POM rules (hard)

- **All DOM interaction lives in POMs.** Specs must not call `page.locator`, `page.click`, `page.waitFor*`, etc.
- **All assertions live in specs or in named flow helpers that take `expect` as a parameter.** POMs must not call `expect()`.
- POMs extend `BasePage` and use one of:
  - `this.locator(id)` → `data-testid="<id>"` (existing attributes)
  - `this.e2eLocator(id)` → `data-e2e="<id>"` **(preferred for new selectors)**
- Methods are intent-named, pure async (`captureAllSights()`, `confirmDefaultVehicleType()`). Return values only when meaningful.
- Shared POMs live in `shared/pages/` and are re-exported from each app's `pages/index.ts` — don't duplicate.

---

## Flows

Specs orchestrate POMs through small named `async` functions in `shared/flows/`. A flow takes the POM instances it needs and runs them in sequence. Specs wrap each flow call in `test.step()` so the HTML report tells the story.

Rules:

- A flow is **not** a fixture. The spec passes its fixture-injected POMs in directly. This keeps flows composable across apps without touching fixture wiring.
- A flow does **not** call `expect()`. The one explicit exception is an assertion helper that takes `expect` as a parameter (e.g. `assertGalleryUploadsComplete(galleryPage, expect, opts)`) — the rule break is local and visible at every call site.
- **Arg convention**: ≤2 POMs → positional args; 3+ POMs → a single object arg so call sites stay readable and reorderable.
- One flow per file under `shared/flows/`, re-exported from `shared/flows/index.ts`.

Before adding a multi-POM sequence inline in a spec, check whether an existing flow covers it — if you'd be the second copy, extract it first.

---

## Module conventions

- **No passthrough re-exports.** Do not re-export a symbol unchanged just to provide a shorter import path. If you are wrapping, renaming, or merging, re-exporting is fine. Otherwise import from the source. The per-app `fixtures/index.ts` is the canonical test API for its specs and is the only place that re-exports `expect` from `@playwright/test`.

---

## `data-e2e` selector reference

`data-e2e` is the preferred selector for new locators: decoupled from styling, never used for business logic, kebab-case, additive (never modify existing `data-testid`).

| `data-e2e`                 | Component                      | POM method                                                   |
| -------------------------- | ------------------------------ | ------------------------------------------------------------ |
| `permissions-confirm`      | `VideoCapturePermissions.tsx`  | `PermissionsPage.grantPermissions()`                         |
| `tutorial-continue`        | `VideoTutorial.tsx`            | `TutorialPage.completeTutorial()`                            |
| `photo-tutorial-next`      | `PhotoCaptureHUDTutorial.tsx`  | `PhotoCaptureTutorialPage.completeTutorial()`                |
| `vehicle-type-card-<type>` | `VehicleTypeSelectionCard.tsx` | `VehicleTypeSelectionPage.vehicleTypeCard(type)`             |
| `vehicle-type-confirm`     | `VehicleTypeSelection.tsx`     | `VehicleTypeSelectionPage.confirmDefaultVehicleType()`       |
| `gallery-submit`           | `InspectionGalleryTopBar.tsx`  | `GalleryPage.submit()`                                       |
| `video-capture-proceed`    | `VideoCaptureComplete.tsx`     | `VideoCaptureCompletePage.confirmAndProceedToPhotoCapture()` |

---

## Footguns

- **MemoryRouter** — both apps use React Router's `MemoryRouter`, so the browser URL never changes. `page.waitForURL()` will hang forever. ✅ Wait for a distinctive locator instead:
  ```typescript
  await this.e2eLocator("vehicle-type-confirm").waitFor({
    state: "visible",
    timeout: 30_000,
  });
  ```
- **Disabled-button races** — `GalleryPage.submit()` waits for `[data-e2e="gallery-submit"]:not([disabled])` before clicking. Mirror this pattern for any button that becomes enabled only after async work (uploads, processing).
- **Compass priming** — `VideoCapturePage.recordWalkaround()` dispatches one `DeviceOrientationEvent` _before_ clicking record so coverage starts from a known bearing. Don't reorder those steps.
- **Compass defaults** — `shared/utils/compass.ts::simulateWalkaround(page, options?)` defaults (`startAlpha=180`, `totalDegrees=370`, `stepDegrees=5`, `intervalMs=540` ≈ 40 s) satisfy both 270° min walkaround coverage **and** 15 s min recording duration. Changing one without the other will break recording.
- **Fake camera** — fake-media Chromium flags are set in `playwright.config.ts`. `FAKE_VIDEO_PATH` is optional; if the file doesn't exist the flag is omitted (`fs.existsSync` check) and Chromium uses its built-in test pattern. CI provides a real `.y4m`.
- **Auth URL is the only entry point** — both apps read the JWT from `?t=`. Don't try to call API login; the `authenticatedPage` fixture is the only supported way in.

---

## Auth URL format

```
<baseUrl>?t=<encodeURIComponent(btoa(pako.deflate(rawToken)))>[&i=<inspectionId>][&v=<vehicleType>]
```

Built by `buildAuthUrl(baseUrl, { inspectionId?, vehicleType? })` in `shared/utils/token.ts`. The default `authenticatedPage` fixture passes no options. To start a test mid-flow (skip inspection creation / vehicle type), build a custom fixture that calls `buildAuthUrl(baseURL, { inspectionId, vehicleType })` and `page.goto`s the result.

---

## Cookbooks

### Add a test

1. Create `apps/<app>/tests/<name>.spec.ts`.
2. `import { test, expect } from "../fixtures";`
3. Destructure the POM fixtures you need. Add new POMs first if missing.
4. Compose the test from named flows in `shared/flows/` wrapped in `test.step()`. If your test repeats a multi-POM sequence another spec already uses (or will), extract it into `shared/flows/` first.

### Add a flow

1. Create `shared/flows/<verbNoun>.ts`. Name it after the user-visible journey (`completePhotoCaptureJourney`, not `clickButtons`).
2. Take the POM instances as args. ≤2 POMs positional, 3+ as a single object arg.
3. Do not import or call `expect()` — unless this is an assertion helper, in which case take `expect` as a parameter.
4. Re-export from `shared/flows/index.ts`.

### Add a POM

1. Create `apps/<app>/pages/XxxPage.ts` extending `BasePage` (or `shared/pages/` if both apps will use it).
2. Use `this.e2eLocator(...)` for new selectors, `this.locator(...)` only when reusing an existing `data-testid`.
3. Export from `apps/<app>/pages/index.ts`.
4. Register in `apps/<app>/fixtures/index.ts` as `xxxPage: async ({ page }, use) => use(new XxxPage(page))`.

### Add a `data-e2e` selector

1. Add `data-e2e="<kebab-name>"` to the component in `packages/...`. Don't touch existing `data-testid`.
2. Reference it from a POM via `this.e2eLocator("<kebab-name>")`.
3. Append a row to the reference table above.

### Add a new app

1. Create `apps/<new>/{fixtures,pages,tests}/`.
2. Add a project to `playwright.config.ts` using **`testDir: './apps/<new>/tests'`** (not `testMatch`), copying the existing project shape (`...devices["Desktop Chrome"]`, `baseURL: env.<new>.baseUrl`).
3. Add `<NEW>_URL` to `shared/config/environments.ts` and `.env.example`.
4. Create `apps/<new>/fixtures/index.ts` extending `shared/fixtures/auth.fixture.ts`. Re-export `expect` from `@playwright/test` at the bottom.
5. Add a `webServer` entry in `playwright.config.ts` following the existing pattern: `command: "yarn start"`, `cwd` pointing at the app dir, `url: env.<new>.baseUrl`, `reuseExistingServer: !process.env["CI"]`. Make sure the app's `local` profile in `.env-cmdrc.json` sets the matching `PORT` and `HTTPS: "true"`.
