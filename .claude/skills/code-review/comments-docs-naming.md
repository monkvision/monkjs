# Comments, TS-doc & naming

Loaded by `/code-review` when the diff adds comments, adds or changes exported symbols, or
introduces new names.

## Rules

- **TS-doc on every export.** One short sentence saying what it is or does. Props and handle
  interfaces document each field in one line. Add `@default` for defaulted options.
- **TS-doc doesn't restate the signature.** No `@param x the x` or `@returns the result`, and no
  bullet lists of implementation steps.
- **TS-doc sits on the symbol it describes.** A doc about a parser belongs on the parser, not on
  the constants above it.
- **Comments are the exception.** Keep one only for a _why_ the code can't express: a browser bug
  workaround, a backend quirk, a non-obvious constraint. Delete _what_ comments, section banners and
  commented-out code.
- **If a comment is needed to explain _what_, rename instead.** Extract a well-named variable or
  function.
- **Naming reads like a story:**
  - Booleans: `is` / `has` / `should` / `can` prefix (`isUploading`, `hasFailedImages`).
  - Handlers: `handle<Event>` inside, `on<Event>` as props.
  - Hooks: `use<Thing>`; their interfaces `<Thing>Params` / `<Thing>Handle`.
  - No vague names: `data`, `res`, `item2`, `flag`, `tmp`, `obj`, `val`.
  - No abbreviations beyond common ones (`id`, `url`, `api`, `ocr`).
  - Constants: `SCREAMING_SNAKE_CASE` at module level.
- **No magic numbers.** Name timeouts, limits and thresholds as constants.

## Examples

### Unnecessary and misplaced TS-doc

Bad:

```ts
/**
 * Parses a raw OCR string from an odometer reading.
 * - Keeps only the integer part (drops everything after a decimal point).
 * - Detects "km" → KM and "mi"/"miles" → MILES (case-insensitive).
 * - Strips all other non-numeric characters.
 */
const KM_RE = /km|kilo(?:met(?:er|re)s?)?/i;
// Covers: mi, mil, mile, miles — and common OCR confusions (ml, m1, mii)
const MILES_RE = /m(?:i|l|1){1,2}(?:l?e?s?)?(?!\p{L})/u;
```

Good:

```ts
const KM_RE = /km|kilo(?:met(?:er|re)s?)?/i;
const MILES_RE = /m(?:i|l|1){1,2}(?:l?e?s?)?(?!\p{L})/u;
```

The doc described a parser but was attached to a non-exported regex, and its bullets narrated the
implementation. If the parser is exported, it gets one line, e.g.
`/** Extracts the mileage value and unit from a raw odometer OCR string. */`.

### "What" comment vs "why" comment

Bad:

```ts
// Loop over the images and keep only the failed ones
const failedImages = images.filter((image) => image.status === ImageStatus.UPLOAD_FAILED);

// Set loading to true
loading.start();
```

Good:

```ts
const failedImages = images.filter((image) => image.status === ImageStatus.UPLOAD_FAILED);
loading.start();
```

Kept, because the code can't say it:

```ts
// Safari fires `online` before the connection is usable; wait before retrying.
const ONLINE_RETRY_DELAY_MS = 1000;
```

### Bloated vs missing TS-doc

Bad:

```ts
/**
 * This function is a custom React hook that is used in order to retry the upload of the
 * images. It takes the params object as a parameter.
 *
 * @param params The params.
 * @returns An object containing the retry function.
 */
export const useUploadRetry = (params: UploadRetryParams): UploadRetryHandle => { ... };

export const MAX_UPLOAD_RETRIES = 3;
```

Good:

```ts
/**
 * Retries failed image uploads, automatically when back online or on demand.
 */
export const useUploadRetry = (params: UploadRetryParams): UploadRetryHandle => { ... };

/**
 * Maximum number of automatic retries for a single image upload.
 */
export const MAX_UPLOAD_RETRIES = 3;
```

### Names that explain themselves

Bad:

```ts
const flag = images.some((i) => i.status === ImageStatus.UPLOAD_FAILED);
const handle2 = () => retry(data);
setTimeout(check, 30000);
```

Good:

```ts
const NETWORK_CHECK_INTERVAL_MS = 30_000;

const hasFailedUploads = images.some((image) => image.status === ImageStatus.UPLOAD_FAILED);
const handleRetryClick = () => retryUploads(failedImages);
setTimeout(checkNetworkStatus, NETWORK_CHECK_INTERVAL_MS);
```

### Commented-out code and section banners

Bad:

```ts
// ===================== HANDLERS =====================
const handleClose = () => setIsOpen(false);
// const handleOpen = () => setIsOpen(true);
// console.log('closed');
```

Good:

```ts
const handleClose = () => setIsOpen(false);
```

Git keeps the history. Dead code and banners only add noise.
