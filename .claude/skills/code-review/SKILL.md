# Code Review

Review the code changed on the current branch against MonkJs standards: architecture, readability,
comments, TS-doc, performance, security, i18n and tests. Report findings by severity, then offer to
apply the ones the user picks. This file holds the always-on standards and routes to topic files
that are loaded **only** when the diff needs them.

## When to use

Call `/code-review` before opening a PR, after finishing a feature, or when the user asks for a
review of specific files or a PR.

## Inputs (`$ARGUMENTS`)

| Argument              | Diff source                                                    |
| --------------------- | -------------------------------------------------------------- |
| _(none)_              | `git diff main...HEAD` + `git diff HEAD`                       |
| a number, e.g. `1046` | `gh pr diff 1046`                                              |
| `staged`              | `git diff --cached`                                            |
| file/dir paths        | `git diff main...HEAD -- <paths>` + `git diff HEAD -- <paths>` |

## Steps

1. **Map the change.** Run the `--stat` variant of the diff first. Skip:

   - lockfiles, `lib/`, `dist/`, `build/`, snapshots
   - sight data and schemas in `packages/sights/research/`
   - locale JSON. Suggest the `translation-reviewer` agent when locales changed.

2. **Read the hunks, not the repo.** Read the diff hunks of the remaining files. Escalate only as
   needed:

   - Read the full file only when judging its length or structure, or when a hunk lacks context.
   - Before suggesting a new hook or util, grep for an existing one (`packages/common/src`,
     the feature's `hooks/`).
   - Investigate adjacent files one at a time. Stop when the question is answered.

3. **Route.** For each signal present in the diff, read the matching file once. Never load a file
   whose signal is absent.

   | Signal in the diff                                                                                        | Load                                               |
   | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
   | `.tsx` changed, new file/hook/component, a file grows noticeably                                          | [structure.md](structure.md)                       |
   | Added comments, new or changed exported symbols, new names                                                | [comments-docs-naming.md](comments-docs-naming.md) |
   | `useEffect`/`useMemo`/`useCallback`, listeners, timers, streams, lists, heavy work                        | [performance-react.md](performance-react.md)       |
   | Network, storage, env, auth/tokens, `dangerouslySetInnerHTML`, URLs, UI strings, new logic without a test | [security-i18n-tests.md](security-i18n-tests.md)   |

4. **Review** against the core standards below plus the rules of every loaded file.

5. **Report** in the format below.

6. **Apply.** Ask which findings to apply (AskUserQuestion with `multiSelect`, or by number).
   Apply only the chosen ones, then suggest `/lint`.

## Core standards (always on)

- Every exported function, class, enum, interface or variable has a **very short, clear TS-doc**.
- Comments are kept to a bare minimum, only for a non-obvious _why_. The code reads like a story
  through descriptive naming.
- Functional logic (state, effects, handlers, derived values) lives in an existing or new hook in
  `<Feature>/hooks/useX.ts`. **`.tsx` files only render.**
- Files stay short and readable by a person. Judge case by case: flag a file that does more than
  one job or that a person can't comfortably read through (roughly 300–500 lines).
- React components are arrow functions.
- Each package has a flat barrel: new exports are re-exported from `src/index.ts`.
- Code lives in feature folders: `src/<Feature>/` with component, `hooks/` and `*.styles.ts`.
- No `console` outside tests. Errors go through the `@monkvision/monitoring` adapter.
- The package `README.md` is updated when its public API changes.
- Cross-package `@monkvision/*` dependencies pin the exact shared version.
- Changes to public APIs stay backwards compatible where possible (optional props, defaults).

## Severity

| Level       | Meaning                                                                   |
| ----------- | ------------------------------------------------------------------------- |
| **Blocker** | Bug, security issue, leaked secret, broken public contract                |
| **Major**   | Logic in `.tsx`, architecture problem, performance issue, missing cleanup |
| **Minor**   | Naming, missing or bloated TS-doc, unnecessary comment, file too long     |

## Don't flag

- Anything Prettier or ESLint already catches (formatting, import order, unused vars).
- Pre-existing code outside the diff, unless the change makes it worse.
- Speculative issues without a concrete failure scenario.

## No diminishing returns

Every suggested change is a chance to add a bug. Suggest a change only when its benefit clearly
outweighs that risk. Before reporting, ask: _would applying this fix plausibly break something,
and is the gain worth it?_ If not, drop it.

Don't suggest:

- Defensive checks for states the types or callers already rule out (extra `?.`, `?? []`,
  `try/catch` around code that can't throw).
- Rewrites of working logic into an "equivalent" form (`for` ↔ `reduce`, ternary ↔ `if`) with no
  readability gain.
- Memoization, early returns or micro-optimizations without a measurable or obvious cost today.
- Generalizing for hypothetical future cases (new params, abstractions, config options).
- Renames or moves that ripple across many files for a marginal naming gain.
- Changes to public API shapes, effect dependencies or async ordering "for cleanliness". These
  are the fixes most likely to introduce regressions.
- Restating the same point on every occurrence. Report a pattern once and list the locations.

When a valid finding has a risky fix, say so in the finding and give the smallest safe fix, or
none. Fewer, correct findings beat a long list.

## Secrets (org policy)

If the diff contains an API key, token, password or certificate: report it as a **Blocker**,
**never reproduce the value**, and direct rotation via security@acvauctions.com.

## Output format

```md
## Code review — <branch or PR>

Loaded: structure.md, comments-docs-naming.md

### Blocker

1. [useUploadQueue.ts:42](packages/.../useUploadQueue.ts#L42) — Retry timer is never cleared on
   unmount. → Return `clearTimeout(timer)` from the effect.

### Major

2. ...

### Minor

3. ...

**Verdict:** 1 blocker, 2 major. Fix #1 before merging.
```

- One line for the problem, one line for the fix. Add a short snippet only when the fix isn't
  obvious.
- Number the findings continuously so the user can pick them by number.
- Omit empty severity sections. If nothing is found, say so in one line.
