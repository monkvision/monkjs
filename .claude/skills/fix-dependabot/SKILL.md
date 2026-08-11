# Fix Dependabot

Triage and fix GitHub Dependabot / security vulnerability alerts for this repo. Quick,
non-breaking version bumps are applied directly (local edits only); anything that could
impact code is turned into a written plan for the user to approve — never auto-applied.

## When to use

Call `/fix-dependabot` (optionally `/fix-dependabot <alert-number-or-package>`) to review
open Dependabot alerts and resolve the safe ones. Requires the **github MCP** server
configured and running (see `.claude/MCP.md`).

## ⚠️ Ground rules

- **This repo uses Yarn 3.2.4 Berry with `yarn.lock` — there is NO `package-lock.json`.**
  Never edit a lockfile by hand. Fixes are made via `package.json` (direct deps) or the
  root `package.json` `resolutions` block (transitive deps), then `yarn install`
  regenerates `yarn.lock`.
- **Local edits only.** Do not create branches, commit, push, or open PRs. Leave changes
  uncommitted for the user to review via `git diff`.
- **Never auto-apply a code-impacting change.** If a fix requires touching source code, or
  crosses a major version, or has breaking changes in its changelog — stop and produce a
  plan. When in doubt, plan (per CLAUDE.md: 3 iterations then ask).
- All monorepo cross-package deps pin to the **exact shared version** — don't accidentally
  bump a `@monkvision/*` internal dependency.

## Steps

### 1. Fetch open alerts (github MCP)

Use the github MCP to list open Dependabot alerts for `monkvision/monkjs`. If the user
named a specific alert/package, filter to it. For each alert, capture:
- Package name and ecosystem (npm).
- Vulnerable version range and the **first patched version**.
- Severity (critical/high/moderate/low).
- Whether it's a **direct** dependency (appears in some package's `package.json`) or
  **transitive** (only in `yarn.lock`). Determine this with:
  ```bash
  grep -rn '"<pkg>"' packages/*/package.json apps/*/package.json configs/*/package.json package.json
  ```
  No match in any `package.json` → transitive.

Present a short triage table (package, severity, current→patched, direct/transitive,
proposed path) **before** changing anything.

### 2. Triage each alert

Classify into one of two paths:

**AUTO-FIX** (apply directly) — ALL of these must hold:
- The patched version is a **patch or minor** bump (same major), AND
- It's transitive, OR a direct dep whose changelog/release notes for the bump show no
  breaking changes, AND
- No source-code change is required.

**PLAN ONLY** (do not touch code) — ANY of these:
- Major version bump.
- Changelog/release notes mention breaking changes, removed APIs, or migration steps.
- Direct dep with a wide import surface (used across many files).
- You cannot confidently determine breaking-ness within 3 iterations.

Check the changelog with the github MCP (releases/tags of the dependency's repo) or
`npm view <pkg> versions` / the package's CHANGELOG when needed.

### 3a. AUTO-FIX path

For a **transitive** dep — add or update the root `package.json` `resolutions` block. This
is the established pattern here (existing entries: `nth-check`, `form-data`, `tar`,
`undici`, `dompurify`, etc.). Pin to the patched version:
```jsonc
"resolutions": {
  // ...existing...
  "<pkg>": "^<patched-version>"
}
```

For a **direct** dep — bump the version in the owning package's `package.json`.

Then, once per batch of edits:
```bash
yarn install
```
This regenerates `yarn.lock`. Verify the vulnerable version is gone:
```bash
grep -A2 '"<pkg>@' yarn.lock | grep version   # confirm only patched versions remain
```

**Verify the fix didn't break anything:**
```bash
yarn build
yarn test              # or scope to affected workspaces if the change is localized
```
- If build + tests pass → keep the edit; move on.
- If either fails → **revert the edit** (`git checkout -- <files> && yarn install`) and
  **downgrade this alert to the PLAN-ONLY path** instead. A green tree is required for any
  auto-applied fix.

### 3b. PLAN-ONLY path

Do **not** edit any files. Produce a concise written plan per alert:
- The vulnerability (CVE/GHSA id, severity, what's affected).
- Current vs required version and why it's not a safe auto-bump (major/breaking).
- **Impact**: which packages/files import this dep (`grep -rl` the import), what surface changes.
- **Migration steps**: the concrete code changes the bump requires.
- **Risk / test focus**: what to re-test (unit, e2e, demo apps).

Stop and let the user decide. Do not start implementing a plan unless the user approves it.

### 4. Report

Summarize:
- **Applied** (auto-fix): package, versions, files changed, build/test result. Remind the
  user changes are **uncommitted** — review with `git diff`, then commit/PR manually.
- **Planned** (needs approval): one line per alert + pointer to its plan.
- **Downgraded**: any alert that failed verification and became plan-only, with the failure.

## Checklist

- [ ] Open alerts fetched via github MCP and triaged in a table
- [ ] Each alert classified AUTO-FIX vs PLAN-ONLY by the rules above
- [ ] Auto-fixes made via `package.json` / root `resolutions` (never a lockfile by hand)
- [ ] `yarn install` run; `yarn.lock` confirmed free of the vulnerable version
- [ ] `yarn build` + tests pass for every auto-fix (else reverted → plan-only)
- [ ] Plans written for code-impacting / major bumps; no code touched
- [ ] Changes left uncommitted; summary distinguishes applied / planned / downgraded

## Notes

- `resolutions` is the primary lever for transitive vulns and is already how this repo has
  handled them historically — prefer it over trying to coax a transitive bump another way.
- A resolution can pin a version deeper than any direct dep declares; that's expected and
  is exactly what forces the patched version into `yarn.lock`.
- If the github MCP is unavailable (no token / Docker down), stop and point the user to
  `.claude/MCP.md` — do not fall back to guessing alerts from `yarn audit` unless asked.
