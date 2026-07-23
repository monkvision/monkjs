# Deploy

Publish all `@monkvision/*` packages to npm, then open the release PR.

## When to use

Call `/deploy` when the user wants to cut a release: publish the current package versions to npm and follow up with the GitHub release PR.

## ⚠️ Before running

This skill performs **irreversible, publicly-visible actions**: publishing packages to the public npm registry and pushing a new branch + opening a PR on GitHub. Always confirm with the user before running either step, even if they invoked `/deploy` directly — surface the current versions (from `lerna.json` / `package.json`) and ask for a final go-ahead.

## Steps

1. **Check working tree state.** 

   - Make sure the current brand is `main`. 
   - Run `git status`. If there are uncommitted changes, stop and ask the user how to proceed — do not publish from a dirty tree.

2. **Run the CI pipeline:**

   - Run `yarn ci`
   - If there are errors, let the user know about them – do not publish with errors

3. **Run the release PR step:**

   ```bash
   yarn release:pr
   ```

4. **Report the outcome.**

   - Share the PR URL returned by `gh pr create`.
   - Remind the user this PR requires manual approval/merge into `main` — the script does not merge it.
   - Once the user confirms it was merged, continue with the next step

5. **Run the npm deployment:**

   ```bash
   yarn deploy:packages
   ```

   This runs `build:production` across all `@monkvision/*` packages, then `lerna publish from-package --force-publish --yes`, which publishes every package at its current `package.json` version (no version bump) with public npm access.

6. **Check the result before continuing.**
   - If the command exits non-zero, or lerna reports any package failed to publish, **stop immediately**. Do not run `release:pr`. Report the failure output to the user and wait for guidance — a partial publish may need manual cleanup (e.g. some packages published, others didn't).
   - If it succeeds, confirm which packages/versions were published (visible in the lerna output) before moving on.

## Notes

- These two steps are intentionally sequential and gated: `deploy:packages` publishes *already-versioned* code, while `release:pr` bumps the version *after* publishing and opens the PR for that bump. Do not reorder them.
- Never re-run `deploy:packages` after a partial failure without checking with the user first — `lerna publish from-package` will skip versions already on npm, but silently retrying can mask what went wrong.
- Requires `gh` (GitHub CLI) to be authenticated in the current shell for `release:pr` to succeed.
