## Running

Pre-requisites:

``yarn install`

Scripts:

```bash
yarn test                # both projects
yarn test:demo-app
yarn test:demo-app-video
yarn test:ui             # Playwright UI mode
yarn report              # open the last HTML report
```

Playwright cold-starts each (or both) `demo-apps` when running `yarn:test*` commands.

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
