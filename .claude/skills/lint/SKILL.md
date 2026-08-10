# Lint

Run linting (Prettier + ESLint) on the files you just changed, and auto-fix any violations.

## When to use

Call `/lint` at the end of any task that modified source files, or whenever the user reports linting errors.

## Steps

1. **Identify the affected workspaces.** Look at which packages/apps/configs were modified in the current task. If the scope is unclear, run the root-level fix so nothing is missed.

2. **Run lint:fix in each affected workspace.** From the repo root, use:

   ```
   yarn workspace <workspace-name> lint:fix
   ```

   where `<workspace-name>` matches the `name` field in that workspace's `package.json` (e.g. `@monkvision/camera-web`, `@monkvision/types`, `demo-app`).

   To fix every workspace at once (safest after a broad change):

   ```
   yarn lint:fix
   ```

   This runs `lerna run --parallel lint:fix` across all workspaces.

3. **Re-run lint (check only) to confirm no violations remain:**

   ```
   yarn workspace <workspace-name> lint
   ```

   or:

   ```
   yarn lint
   ```

4. **If lint still fails after auto-fix**, read the ESLint/Prettier output carefully and manually correct the remaining issues. Common ones:

   - Unused imports or variables (`@typescript-eslint/no-unused-vars`)
   - Missing return types on exported functions
   - Import ordering (handled by `eslint-plugin-import`)
   - Line length over 100 chars (Prettier) or 120 chars (ESLint `max-len`)
   - `no-console` violations — remove or replace with a proper logger

5. **Verify** by running the check-only command one more time and confirming it exits with code 0.

## Key rules in this repo

- **Prettier**: `singleQuote: true`, `printWidth: 100`, `trailingComma: 'all'`, `semi: true`, `tabWidth: 2`
- **ESLint base**: extends `airbnb-base` + `@typescript-eslint/recommended` + `plugin:import/recommended`
- **React packages**: additionally enforce `jsx-a11y` and `react-hooks` rules
- `**/*.js` files, `node_modules`, and `dist` are ignored by ESLint

## Notes

- Always prefer `lint:fix` over `lint` when you have just generated or edited code — it handles formatting automatically.
- The `lint` script in each workspace runs `prettier --check` then `eslint --format=pretty`; `lint:fix` runs the `--write`/`--fix` variants.
- Some workspaces (e.g. `documentation`, `sights`) have extra steps in `lint:fix` (typecheck, SVGO) — the `yarn workspace` command handles this transparently.
