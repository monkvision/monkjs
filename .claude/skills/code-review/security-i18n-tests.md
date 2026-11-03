# Security, i18n & tests

Loaded by `/code-review` when the diff touches network calls, storage, env vars, auth or tokens,
`dangerouslySetInnerHTML`, URLs, user-facing strings, or adds logic without a test.

## Security

- **No secrets in code, config, tests or logs.** API keys, tokens, passwords and certificates are
  **Blockers**. Never reproduce the value in the review. Direct rotation via
  security@acvauctions.com. Env values come from `.env` / app config, never hardcoded fallbacks.
- **Auth tokens** go through the existing app state (`MonkApplicationStateProvider`,
  `STORAGE_KEY_AUTH_TOKEN` in `packages/common/src/apps/appStateProvider.tsx`). No new storage
  keys, URL params or cookies for tokens.
- **Nothing sensitive in monitoring or analytics.** Calls to `handleError`, `setTags`,
  breadcrumbs and analytics events carry no tokens, full API responses, VINs tied to people, or
  user personal data.
- **No `dangerouslySetInnerHTML`** with anything not fully controlled by the package.
- **URLs** built from input or search params are validated (protocol allow-list) before use in
  `href`, `src`, `window.open` or `fetch`.
- **No `eval`, `new Function`** or dynamic `import()` of computed paths.
- **Network:** requests go through `@monkvision/network` (`useMonkApi`) so auth headers,
  dispatching and error handling stay consistent. Retries are capped.
- **Dependencies:** new packages must use an approved license (MIT, ISC, BSD, Apache 2.0, MPL 2.0,
  ...). Others need approval via opensource@acvauctions.com.

## i18n

- Every user-facing string (text, `alt`, `aria-label`, `title`, placeholder) goes through `t()`.
- New keys exist in **every** locale file of the package. When locales changed, suggest the
  `translation-reviewer` agent instead of checking them manually.
- No string concatenation of translated fragments. Use interpolation (`t('key', { count })`).

## Tests

- New or changed hooks and utils have Jest tests in the package's `test/` tree, mirroring `src/`
  (e.g. `test/PhotoCapture/hooks/useImagesCleanup.test.ts`).
- New branches (error paths, retries, offline) are covered, not just the happy path.
- A test failing with `Cannot read properties of undefined` on a new enum usually means
  `@monkvision/types` `lib/` is stale: rebuild it before calling the test broken.

## Examples

### Secret in code

Bad:

```ts
const POSTHOG_TOKEN = 'phc_<redacted>';
```

Good:

```ts
const posthogToken = process.env['VITE_POSTHOG_TOKEN'];
```

The review states "hardcoded PostHog token at `config.ts:12`: rotate via
security@acvauctions.com" without quoting the value.

### Leaking data to monitoring

Bad:

```ts
monitoring.handleError(err, { extras: { authToken, response } });
```

Good:

```ts
monitoring.handleError(err, { extras: { inspectionId, status: response.status } });
```

### Hardcoded UI strings

Bad:

```tsx
<Button onPress={retryUploads}>Retry failed uploads</Button>
<img src={imageUri} alt="Odometer" />
```

Good:

```tsx
<Button onPress={retryUploads}>{t('photo.hud.uploads.retry')}</Button>
<img src={imageUri} alt={t('photo.hud.ocr.imageAlt')} />
```

### Unvalidated URL

Bad:

```ts
window.open(searchParams.get('redirect') ?? '/');
```

Good:

```ts
const redirectUrl = searchParams.get('redirect');
const isSafeRedirect = !!redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//');
window.open(isSafeRedirect ? redirectUrl : '/');
```
