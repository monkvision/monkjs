# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

MonkJs is a React SDK for integrating Monk AI vehicle damage detection workflows into web apps. It is an open-source monorepo managed with **Yarn 3.2.4 Berry** (node-modules linker) + **Lerna 9**. All packages share a single version number (e.g. `5.3.11`), bumped together at release.

## Architecture

Workspace roots:

- `packages/` — 12 publishable `@monkvision/*` SDK packages
- `configs/` — shared dev-tool configs (TypeScript, Jest, ESLint, Prettier, SVGO)
- `apps/` — 2 private CRA demo apps (`demo-app`, `demo-app-video`)
- `documentation/` — Docusaurus site
- `e2e/` — Playwright E2E suite

## Technical design patterns

**State management** (`@monkvision/common`): Redux-like `context + reducer + provider`, no Redux dependency. `MonkState` is the central state shape; `dispatch` is threaded into network calls. Apps wrap with `MonkApplicationStateProvider`.

**Adapter pattern** for analytics and monitoring: `@monkvision/analytics` and `@monkvision/monitoring` define interfaces with no-op `EmptyAdapter` defaults. `@monkvision/posthog` and `@monkvision/sentry` implement the interfaces. Apps inject the adapter at init.

**i18n**: `i18next` + `react-i18next`. Each package ships its own translation files and exposes an `i18n` registration function.

**Flat barrel exports**: every package's `src/index.ts` re-exports everything; consumers import from `@monkvision/<name>` only.

**Feature folders**: `src/<Feature>/` contains component + hooks + styles together.

**Documentation**: every exported function, class, enum, or variable should contain a `TS-doc`. Every package has its own `README.md`, it should stay up-to-date.

## Code Style

- **Prettier**: 100-char print width, 2-space indent, single quotes, trailing commas everywhere, LF, semicolons
- **ESLint**: airbnb-base + TypeScript rules; React packages also include `jsx-a11y/recommended`
- React components must be **arrow functions** (`react/function-component-definition`)
- `no-console` is an error in all non-test, non-types packages

## Publishing

Done in 2 steps:

1. First, NPM deployment

```bash
yarn deploy:packages
```

All packages publish as `@monkvision/*` with `"access": "public"` on npm. Cross-package monorepo dependencies always pin to the exact shared version.

2. Open a new GitHub PR to merge the changes

```bash
yarn release:pr
```

This has to be approved by a User, due to GitHub direct merge into `main` restrictions.

## MCP servers

Configured in `.mcp.json`; secrets load from a git-ignored root `.env`. See `.claude/MCP.md`
for setup, token requirements, and how to add a new server.

## Thinking and reasoning rules

### Common rules to follow:

- if you don't understand the context within **3 iterations**, stop and ask the user for guidance
- once the fix is approved, change to clean, robust, secured implementation
- investigate adjacent files bit by bit, instead of going too quick too deep

### When prompted to solve a bug, follow these rules:

- start small, with a quick, hard-coded solution and ask the user to verify if it works

### When prompted to implement a feature/change, follow these rules:

- think of an non-invasise solution that would require backwards-compatibility if possible