# Performance & React

Loaded by `/code-review` when the diff touches `useEffect` / `useMemo` / `useCallback`,
listeners, timers, media streams, list rendering or heavy computation.

## Rules

- **Derive, don't sync.** A value computable from props or state is a variable (or `useMemo` if
  expensive), not `useState` kept in sync by an effect.
- **Effect dependencies are complete and stable.** Missing deps are bugs. Object or array deps
  created during render re-run the effect every time.
- **Everything started is stopped.** Listeners, intervals, timeouts, `MediaStream` tracks, object
  URLs and subscriptions are released in the effect cleanup. Prefer `useInterval`,
  `useSafeTimeout` and `useIsMounted` from `@monkvision/common`.
- **No state updates after unmount.** Async work checks `useIsMounted` or is aborted.
- **Stable references where they matter.** Callbacks and objects passed to memoized children,
  context values, or effect deps are wrapped in `useCallback` / `useMemo`. Returned hook handles
  use `useObjectMemo`.
- **Don't memoize trivia.** `useMemo(() => a + b, [a, b])` or `useCallback` on a handler passed to a
  plain DOM element is noise (Nit).
- **Lists** use stable, unique keys (`image.id`), never the array index when items can reorder or be
  removed.
- **Look up once.** Repeated `.find()` / `.filter()` over the same array in one render is computed
  once and reused.
- **Keep render pure and cheap.** No sorting large arrays, parsing images or creating
  `new Date()`-based logic inline in JSX. No mutation of state arrays (`.sort()` sorts in place;
  copy first).
- **Network and retries** use backoff and a cap, and don't fire from every render.

## Examples

### Derived state

Bad:

```ts
const [failedCount, setFailedCount] = useState(0);

useEffect(() => {
  setFailedCount(images.filter((image) => image.status === ImageStatus.UPLOAD_FAILED).length);
}, [images]);
```

Good:

```ts
const failedCount = useMemo(
  () => images.filter((image) => image.status === ImageStatus.UPLOAD_FAILED).length,
  [images],
);
```

### Missing cleanup

Bad:

```ts
useEffect(() => {
  window.addEventListener('online', retryFailedUploads);
  setInterval(checkNetworkStatus, NETWORK_CHECK_INTERVAL_MS);
}, []);
```

Good:

```ts
useEffect(() => {
  window.addEventListener('online', retryFailedUploads);
  return () => window.removeEventListener('online', retryFailedUploads);
}, [retryFailedUploads]);

useInterval(checkNetworkStatus, NETWORK_CHECK_INTERVAL_MS);
```

### Unstable references to memoized children

Bad:

```tsx
<SightSlider
  sights={sights}
  style={{ marginTop: 8 }}
  onSelectSight={(sight) => selectSight(sight.id)}
/>
```

Good:

```ts
const handleSelectSight = useCallback((sight: Sight) => selectSight(sight.id), [selectSight]);
```

```tsx
<SightSlider sights={sights} style={styles['slider']} onSelectSight={handleSelectSight} />
```

### In-place mutation of state

Bad:

```ts
const latestImage = state.images.sort((a, b) => b.createdAt - a.createdAt)[0];
```

Good:

```ts
const latestImage = [...state.images].sort((a, b) => b.createdAt - a.createdAt)[0];
```
