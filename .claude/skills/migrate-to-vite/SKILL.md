# Migrate to Vite

Migrate a Create-React-App (`react-scripts`) app to **Vite 7**, and bump `react-router-dom`
v6 → v7. Written for apps that are copy-pastes of `apps/demo-app` / `apps/demo-app-video`,
so the same set of edits applies almost mechanically each time. Reference migration:
`apps/demo-app` and `apps/demo-app-video`.

## When to use

Call `/migrate-to-vite <app-path>` when an app still depends on `react-scripts@5.0.1` and
needs to move to Vite. Removing `react-scripts` is also what clears the CRA-only Dependabot
alerts (webpack-dev-server, svgo 1.x, @tootallnate/once) — they trace exclusively to
`react-scripts`.

## ⚠️ Ground rules

- **Local edits only** unless the user says otherwise — no branches, commits, pushes, or PRs.
- **Yarn 3.2.4 Berry, `yarn.lock` only** — there is NO `package-lock.json`. Never hand-edit a
  lockfile; run `yarn install` and let it resolve.
- Keep **Jest** as the test runner. Do NOT switch to Vitest — Jest config is unrelated to the
  bundler and already works.
- Work one app at a time; validate before moving to the next.

## Assumptions

The target app is a CRA app shaped like `demo-app`: entry `src/index.tsx`, HTML in
`public/index.html` with `%PUBLIC_URL%` tokens, env vars prefixed `REACT_APP_`, an
`.env-cmdrc.json`, and it consumes `@monkvision/*` workspace packages. If it diverges, diff it
against `apps/demo-app` first and adapt.

## Steps

### 1. package.json

- **Remove** `"react-scripts"` and `"@types/react-router-dom"` from `dependencies` /
  `devDependencies`.
- **Bump** `"react-router-dom"` → `"^7.9.4"`.
- **Add** devDeps (copy exact versions from `apps/demo-app/package.json`, don't guess):
  `vite`, `@vitejs/plugin-react`, `@vitejs/plugin-basic-ssl`, `babel-plugin-react-compiler`,
  `@babel/core`. Keep `env-cmd` and `source-map-explorer`.
- **Rewrite `scripts`** to match `apps/demo-app` — the CRA commands map to:

  | CRA | Vite |
  |---|---|
  | `react-scripts start` | `vite` |
  | `react-scripts build` | `tsc -b && vite build` |
  | `react-scripts test` | `jest` (unchanged) |
  | `source-map-explorer 'build/static/js/*.js'` | `source-map-explorer 'build/assets/*.js'` |

  Every `env-cmd -e <env> react-scripts (start\|build)` becomes `env-cmd -e <env> vite` /
  `env-cmd -e <env> vite build`.

### 2. vite.config.ts

Create at the app root, mirroring `apps/demo-app/vite.config.ts`. Change only the **port
default** (each app needs a unique one — demo-app `17200`, video `17201`) and the
`optimizeDeps.include` list (only the `@monkvision/*` packages this app actually imports):

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    basicSsl(),
    react({ babel: { plugins: [['babel-plugin-react-compiler']] } }),
  ],
  define: {
    'process.env': 'import.meta.env',
  },
  server: { port: Number(process.env['PORT']) || 17200 },
  preview: { port: Number(process.env['PORT']) || 17200 },
  optimizeDeps: {
    include: [/* the @monkvision/* packages this app imports */],
  },
  build: {
    outDir: 'build',
    commonjsOptions: { include: [/node_modules/, /packages/] },
  },
});
```

Every clause matters — see **Key facts** for why `define`, the `PORT` read, `outDir: 'build'`,
and `commonjsOptions.include` are non-negotiable.

### 3. HTML + entry point

- Move `public/index.html` → `index.html` at the **app root** (Vite serves the root HTML).
- Strip CRA tokens: replace `%PUBLIC_URL%/foo` with `/foo`.
- Before `</body>`, add the module entry: `<script type="module" src="/src/main.tsx"></script>`.
- Rename the entry `src/index.tsx` → `src/main.tsx` (match the `<script src>`).
- **Delete the leftover `public/index.html`.** Vite copies everything in `public/` verbatim
  into the build output, so a stale `public/index.html` would overwrite the real generated
  `build/index.html`. This file is usually git-untracked but present on disk in copy-pasted
  apps — remove it.

### 4. Environment variables (REACT_APP_ → VITE_)

Vite only exposes vars prefixed `VITE_`. Rename **everywhere**, in lockstep:

- `.env-cmdrc.json` — every `REACT_APP_*` key → `VITE_*`. Check **all** environment blocks
  (local, development, staging, preview, …); it's easy to miss one.
- Source code — `process.env.REACT_APP_FOO` → `process.env['VITE_FOO']` (bracket access, see
  TS4111 in Key facts). The `define` hack keeps `process.env.X` working at runtime, so you only
  rename the key, not the access pattern.
- **Watch for dropped logic during CRA→pages refactors**: diff the live config loader against
  the old one and restore any conditional branch that silently survived only in dead code.

### 5. react-router v7

- App already bumped to `react-router-dom@^7.9.4` in step 1.
- Remove obsolete future flags: `<MemoryRouter future={{ v7_startTransition: true }}>` →
  `<MemoryRouter>` (all `v7_*` flags are defaults in v7).
- The common v6 APIs (`MemoryRouter`, `Routes`, `Route`, `Navigate`, `Outlet`, `useNavigate`,
  `AuthGuard`'s `Navigate`) are unchanged in v7 — no code changes needed beyond the flag.
- If this app imports an `@monkvision/*` package that peer-depends on `react-router-dom`,
  confirm that peer range allows v7 (`^6.22.3 || ^7.0.0`), and widen it if not.

### 6. tsconfig + gitignore hygiene

- `tsconfig.node.json` (the one that `include`s `vite.config.ts`): add
  `"noEmit": true` under `compilerOptions`, else `tsc -b` emits `vite.config.js/.d.ts/.map`
  next to the source.
- Add `*.tsbuildinfo` to the app's `.gitignore`.
- Delete CRA leftovers: `src/react-app-env.d.ts`, any dead root `App.tsx` / duplicate
  `components/` tree left over from a copy-paste.

### 7. Install & validate

Run from the repo root:

```bash
yarn install                       # resolves the lockfile — never hand-edit it
yarn workspace <pkg-name> build    # must emit into build/ (assets/ + index.html)
yarn workspace <pkg-name> test     # Jest, must pass
yarn workspace <pkg-name> lint     # Prettier + ESLint clean
yarn workspace <pkg-name> start    # smoke: boots on the expected HTTPS port, serves the app
```

Then sanity-check `yarn.lock`: `react-scripts` should be gone, and with it the vulnerable
`webpack-dev-server` 4.x, `svgo` 1.x, and `@tootallnate/once` trees.

## Key facts (the non-obvious ones)

- **`define: { 'process.env': 'import.meta.env' }`** is what lets the shared SDK's
  `getEnvOrThrow(name)` (which reads `process.env[name]`) work in the browser. Keep it. It does
  **not** clobber `NODE_ENV`: Vite's own built-in longest-match define for
  `process.env.NODE_ENV` still wins and folds to a literal — verified by bundle inspection.
- **Vite ignores `PORT`** unless the config reads it. `Number(process.env['PORT']) || <default>`
  is required for env-cmd's `PORT` to take effect.
- **`outDir: 'build'`** (not Vite's default `dist`) — CI (`deploy-demo-app*.yml`) uploads
  `build/`. Wrong dir = broken deploy that still "builds" locally.
- **`commonjsOptions.include: [/node_modules/, /packages/]`** — the workspace `@monkvision/*`
  packages ship CommonJS; without this, Vite's build fails to interop them.
- **TS4111**: this repo sets `noPropertyAccessFromIndexSignature`, so index-signature props
  (`process.env['PORT']`, `process.env['VITE_FOO']`) MUST use bracket access or `tsc` fails.
- **Unique ports per app** — two apps defaulting to the same port collide when run at the same
  time. Give each app its own default.
- **`analyze`** needs `build.sourcemap: true` to actually run against `build/assets/*.js`; it was
  already broken under CRA, so only add sourcemaps if the user wants `analyze`.

## Out of scope / flag, don't fix

- `web-vitals` is an unused CRA leftover dep — harmless, mention it.
- Widening SDK React peers to `^18 || ^19` if the app is on React 19 — warnings only.
- Any `build:jinx`-style script referenced by a workflow but never defined — pre-existing, needs
  an env decision from the user.
