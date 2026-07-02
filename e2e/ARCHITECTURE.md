# E2E Architecture

This document describes the design of the `e2e/` end-to-end test suite for the MonkJS monorepo.

---

## Directory Structure

```
e2e/
├── assets/
│   └── fake-camera.y4m        # Fake video feed for Chromium's fake device API
├── apps/
│   ├── demo-app/
│   │   ├── fixtures/          # App-specific fixture composition
│   │   ├── pages/             # App-specific Page Object Models
│   │   └── tests/             # Spec files for this app
│   └── demo-video-app/
│       ├── fixtures/
│       ├── pages/
│       └── tests/
├── shared/
│   ├── config/
│   │   └── environments.ts    # Typed env variable access
│   ├── fixtures/
│   │   └── auth.fixture.ts    # Base authenticated-page fixture
│   ├── pages/
│   │   ├── BasePage.ts        # Abstract POM base (locator helpers)
│   │   ├── GalleryPage.ts     # Shared gallery POM (both apps)
│   │   └── PhotoCapturePage.ts # Shared photo capture POM (both apps)
│   └── utils/
│       ├── camera.ts          # Chromium fake-camera launch args
│       ├── compass.ts         # DeviceOrientationEvent simulation
│       └── token.ts           # JWT compression and auth URL builder
├── .env.example               # Required environment variables documentation
├── .yarnrc.yml                # Standalone yarn config (reuses monorepo binary)
├── ARCHITECTURE.md            # This file
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── yarn.lock
```

---

## Key Architectural Decisions

### Standalone Package

`e2e/` is intentionally **not** a monorepo workspace. It has its own `yarn.lock` and `node_modules`. This isolates Playwright version from the monorepo, simplifies CI setup, and avoids transitive dependency conflicts.

The yarn binary is reused from the monorepo via `.yarnrc.yml`:
```yaml
yarnPath: ../.yarn/releases/yarn-3.2.4.cjs
nodeLinker: node-modules
```

To install: `cd e2e && yarn install`

---

### Authentication Strategy

Both apps read the auth token from the URL query string (`?t=<compressed-jwt>`). The compression format matches the app's internal `zlibCompress` implementation:

```
rawToken → pako.deflate → btoa → encodeURIComponent → ?t=<value>
```

The raw JWT is injected via the `TEST_TOKEN` environment variable. **No API mocking is used** — tests run against a real dev/staging API. This gives the most realistic coverage.

`buildAuthUrl(baseUrl, options?)` in `shared/utils/token.ts` also accepts optional `inspectionId` and `vehicleType` params (appended as `?i=` and `?v=`) to allow tests to skip early-flow steps and jump into a specific state.

---

### Page Object Model (POM) Rules

- **All element interactions live in POM files** — spec files must not call `page.locator()` or `page.click()` directly.
- **All assertions live in spec files** — POMs must not call `expect()`.
- **POMs expose pure, intent-named async methods** (`captureAllSights()`, `confirmDefaultVehicleType()`, etc.).
- **Shared POMs** (`GalleryPage`, `PhotoCapturePage`) live in `shared/pages/` and are re-exported from app-level `pages/index.ts` without duplication.
- **App-specific POMs** live in `apps/<app>/pages/`.

---

### Fixture Layering

```
Playwright base test
  └─ auth.fixture.ts (authenticatedPage — navigates to ?t=<token>)
       └─ apps/<app>/fixtures/index.ts (all page objects for that app)
```

Each app's fixture file imports the auth fixture and extends it with page-scoped POM instances. Spec files import `{ test, expect }` from the local `fixtures/` directory — they never import from Playwright directly.

---

### Selector Strategy

Two helpers are available on `BasePage`:

| Helper | Selector | Used for |
|---|---|---|
| `this.locator(id)` | `[data-testid="<id>"]` | Existing `data-testid` attrs |
| `this.e2eLocator(id)` | `[data-e2e="<id>"]` | Dedicated e2e attributes |

**`data-e2e` attributes are the preferred selector for all new locators.** They are:
- Decoupled from CSS classes, IDs, text content, and component structure.
- Never used for styling or business logic — purely for test targeting.
- Named in kebab-case: `gallery-submit`, `vehicle-type-card-sedan`, `tutorial-continue`.
- Added additively; existing `data-testid` values are never modified.

#### data-e2e Attribute Reference

| Attribute value | Component file | POM method |
|---|---|---|
| `permissions-confirm` | `VideoCapturePermissions.tsx` | `PermissionsPage.grantPermissions()` |
| `tutorial-continue` | `VideoTutorial.tsx` | `TutorialPage.completeTutorial()` |
| `vehicle-type-card-<type>` | `VehicleTypeSelectionCard.tsx` | `VehicleTypeSelectionPage.vehicleTypeCard(type)` |
| `vehicle-type-confirm` | `VehicleTypeSelection.tsx` | `VehicleTypeSelectionPage.confirmDefaultVehicleType()` |
| `gallery-submit` | `InspectionGalleryTopBar.tsx` | `GalleryPage.submit()` |
| `video-capture-proceed` | `VideoCaptureComplete.tsx` | `VideoCaptureCompletePage.confirmAndProceedToPhotoCapture()` |

---

### Camera Simulation

Playwright launches Chromium with fake media flags so tests never need real camera hardware:

```
--use-fake-ui-for-media-stream
--use-fake-device-for-media-stream
--use-file-for-fake-video-capture=<path-to.y4m>
```

The `.y4m` file path is configured via `FAKE_VIDEO_PATH` env var (defaults to `assets/fake-camera.y4m`). In CI, the file is downloaded from GCS and the path is injected via the env var.

---

### Compass Simulation

Both apps require `DeviceOrientationEvent` to drive the walkaround indicator. Since browsers block this in automated contexts, `shared/utils/compass.ts` provides `simulateWalkaround(page, options?)`, which uses `page.evaluate()` to dispatch synthetic events on a `setInterval`.

Default parameters satisfy both app requirements:
- `startAlpha = 180`, `totalDegrees = 370`, `stepDegrees = 5`, `intervalMs = 210`
- 74 steps × 210ms ≈ 15.5s — satisfies the 270° minimum walkaround and 15s minimum recording duration.

---

### MemoryRouter Navigation Detection

Both apps use React Router's `MemoryRouter`, so the browser URL never changes during navigation. **Never use `page.waitForURL()`** in this suite. Instead, wait for a distinctive element to appear:

```typescript
// ✅ Correct
await this.e2eLocator('vehicle-type-confirm').waitFor({ state: 'visible', timeout: 30_000 });

// ❌ Wrong — URL never changes
await page.waitForURL('**/capture');
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `TEST_TOKEN` | ✅ Yes | — | Raw JWT for API authentication |
| `DEMO_APP_URL` | No | `http://localhost:3000` | Base URL for demo-app |
| `DEMO_VIDEO_APP_URL` | No | `http://localhost:3001` | Base URL for demo-video-app |
| `FAKE_VIDEO_PATH` | No | `assets/fake-camera.y4m` | Path to the `.y4m` fake camera file |

Copy `.env.example` to `.env` and fill in `TEST_TOKEN` before running tests.

---

## Running Tests

```bash
cd e2e

# Install dependencies (first time only)
yarn install

# Run all tests
yarn test

# Run only demo-app tests
yarn test:demo-app

# Run only demo-video-app tests
yarn test:demo-video-app

# Open Playwright UI (interactive mode)
yarn test:ui

# Show the last HTML report
yarn report
```

The `webServer` config in `playwright.config.ts` starts both apps automatically (`reuseExistingServer: true` lets you keep them running for faster iteration).

---

## Adding New Tests

1. Add the spec file under `apps/<app>/tests/<test-name>.spec.ts`.
2. Import `{ test, expect }` from `../fixtures`.
3. Use the fixtures already defined in that app's `fixtures/index.ts`.
4. Add new POM methods in `apps/<app>/pages/` or `shared/pages/` if needed.
5. Add `data-e2e` attributes to package components for any new selectors.

## Adding a New App

1. Create `apps/<new-app>/pages/`, `fixtures/`, and `tests/` directories.
2. Add a new Playwright project in `playwright.config.ts`:
   ```typescript
   { name: 'new-app', testMatch: 'apps/new-app/tests/**/*.spec.ts', use: { baseURL: env.newApp.baseUrl } }
   ```
3. Add the env config to `shared/config/environments.ts`.
4. Add the `webServer` entry and env vars to `.env.example`.
5. Create a fixture file extending `auth.fixture.ts`.

## Adding a New Selector

1. Add `data-e2e="<kebab-name>"` to the component in `packages/`.
2. Add a locator in the relevant POM using `this.e2eLocator('<kebab-name>')`.
3. Update the selector reference table in this file.
