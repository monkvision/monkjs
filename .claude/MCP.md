# MCP Servers

MCP servers are configured in `.mcp.json` (checked in). Secrets are **not** stored there —
each server loads them from a git-ignored root `.env` file.

## One-time setup (per machine)

1. `cp .env.example .env`
2. Fill in the required keys (see `.env.example` for the list and links).
3. Ensure Docker Desktop is running — MCP servers run as Docker containers.

`.env` is git-ignored; `.env.example` is the tracked template. Never commit real tokens.
On next launch, Claude Code will prompt to approve any newly added server.

## Servers

### github

Access to PRs, issues, CI runs, and Dependabot alerts via the official
`ghcr.io/github/github-mcp-server` Docker image.

- **Secret:** `GITHUB_PERSONAL_ACCESS_TOKEN` in `.env`.
- **Token type:** a **fine-grained** personal access token
  (https://github.com/settings/personal-access-tokens), scoped to `monkvision/monkjs`.
- **Recommended permissions (Read-only to start):** Contents, Pull requests, Issues,
  Actions, and Dependabot alerts (Read). Bump specific ones to Write only if you want the
  MCP to create PRs / post comments.
- This token is **separate** from the `gh` CLI used by the release scripts
  (`release:pr`, `/deploy`). `gh` is not installed by default on dev machines.

#### If you're a collaborator, not an org owner

A fine-grained token scoped to the `monkvision` org typically needs **org admin approval**
before it's active — you'll see it as "pending" after creation. If a permission (e.g.
Dependabot alerts) is missing or was granted after the initial approval, editing the
token's permissions re-triggers approval for that change; ping an org admin again.

Separately from the token, Dependabot alert visibility also depends on your **repo role**:
if `https://github.com/monkvision/monkjs/security/dependabot` 403s/404s for you in the
browser, no token will fix it — you need Write access on the repo, not just a token scope.

## Troubleshooting

- **`docker pull ghcr.io/...` fails with `denied: denied`** even for a public image: a
  stale/empty cached credential for `ghcr.io` in Docker's config can poison anonymous
  pulls. Fix: `docker logout ghcr.io`, then retry the pull.
- **A tool call returns `403 Resource not accessible by personal access token`**: the
  token is authenticated but missing that specific permission/scope. For fine-grained
  tokens, add the permission and wait for re-approval (see above); for classic tokens,
  add the missing OAuth scope (e.g. `security_events` for Dependabot alerts).
- **A tool name is "unknown"**: some tools are grouped into toolsets that aren't enabled by
  default (e.g. `list_dependabot_alerts` requires the `dependabot` toolset). Set
  `GITHUB_TOOLSETS=dependabot` (comma-separated for multiple) as an env var on the server
  if a needed tool seems missing from `tools/list`.

## Adding a new server

1. Add the server block to `.mcp.json`, loading secrets via `--env-file .env`.
2. Add the new key(s) to `.env.example` (empty value + a comment linking where to get it).
3. Document the server here under **Servers**.
