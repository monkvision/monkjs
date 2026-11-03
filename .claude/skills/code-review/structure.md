# Structure & architecture

Loaded by `/code-review` when `.tsx` files change, new files, hooks or components appear, or a
file grows noticeably.

## Rules

- **`.tsx` renders, hooks think.** State, effects, handlers and non-trivial derived values belong in
  a hook (`<Feature>/hooks/useX.ts`), exposed through a `XParams` / `XHandle` interface pair like
  `useImagesCleanup`. The component calls the hook and renders.
- **Reuse before creating.** Check the feature's `hooks/` and `packages/common/src/hooks` before
  suggesting a new hook.
- **Name complex expressions.** A multi-condition expression inside JSX props becomes a named
  boolean. Once it depends on several sources, it moves into the hook.
- **Extract JSX blocks into components.** A JSX chunk stored in a variable (`const dialog = (...)`)
  or rendered conditionally with its own props becomes a sub-component with a props interface.
- **No IIFEs in JSX.** Compute values before `return`, or in the hook.
- **One job per file.** A file that renders two unrelated things, or a hook that manages two
  unrelated concerns, is split. Length is a symptom: around 300–500 lines, ask if it does one job.
- **Styles** live in `<Component>.styles.ts`, not inline objects in the `.tsx`.
- **Barrel exports.** Every new public symbol is re-exported from the folder's `index.ts` up to
  `src/index.ts`.
- **Backwards compatibility.** New props on public components are optional with defaults. Renamed
  or removed exports are Blockers unless the PR is a declared breaking change.

## Examples

### Name complex prop expressions

Bad:

```tsx
<HUDButtons
  onTakePicture={handle?.takePicture}
  closeDisabled={!!loading.error || !!handle.error}
  takePictureDisabled={
    !!loading.error ||
    !!handle.error ||
    handle.isLoading ||
    loading.isLoading ||
    (!!ocrConfig &&
      (!ocrSights || !!ocrSights.find((s) => s.sightId === selectedSight.id)) &&
      !isOcrFallbackReady)
  }
  retakeCount={retakeCount}
/>
```

Good:

```tsx
const isWaitingForOcr =
  !!ocrConfig &&
  (!ocrSights || ocrSights.some((sight) => sight.sightId === selectedSight.id)) &&
  !isOcrFallbackReady;

<HUDButtons
  onTakePicture={handle?.takePicture}
  closeDisabled={!!loading.error || !!handle.error}
  takePictureDisabled={
    !!loading.error || !!handle.error || handle.isLoading || loading.isLoading || isWaitingForOcr
  }
  retakeCount={retakeCount}
/>;
```

Once `isWaitingForOcr` and the disabled flags multiply, move them into the HUD's hook and return
them as `isTakePictureDisabled`, `isCloseDisabled`.

### Extract a JSX blob into a component

Bad:

```tsx
export const PhotoCaptureHUDOcrOverlay = (props: PhotoCaptureHUDOcrOverlayProps) => {
  // ...
  const dialog = (
    <div style={styles.dialog}>
      <img src={imageUri} alt={t('photo.hud.ocr.imageAlt')} style={styles.image} />
      <div style={styles.textRow}>
        {displayContent}
        {showUnitDropdown && (
          <select
            style={styles.unitSelect}
            value={selectedUnit ?? MileageUnit.KM}
            onChange={(e) => onUnitChange?.(e.target.value as MileageUnit)}
          >
            <option value={MileageUnit.KM}>{MileageUnit.KM}</option>
            <option value={MileageUnit.MILES}>{MileageUnit.MILES}</option>
          </select>
        )}
      </div>
      <div style={styles.buttons}>{buttonContent}</div>
    </div>
  );

  return <div>{dialog}</div>;
};
```

Good:

```tsx
/**
 * Props accepted by the OcrDialog component.
 */
export interface OcrDialogProps {
  imageUri: string;
  displayContent: ReactNode;
  buttonContent: ReactNode;
  showUnitDropdown: boolean;
  selectedUnit?: MileageUnit;
  onUnitChange?: (unit: MileageUnit) => void;
}

/**
 * Dialog showing the OCR'd odometer picture and its detected value.
 */
export const OcrDialog = ({
  imageUri,
  displayContent,
  buttonContent,
  showUnitDropdown,
  selectedUnit,
  onUnitChange,
}: OcrDialogProps) => {
  const { t } = useTranslation();

  return (
    <div style={styles['dialog']}>
      <img src={imageUri} alt={t('photo.hud.ocr.imageAlt')} style={styles['image']} />
      <div style={styles['textRow']}>
        {displayContent}
        {showUnitDropdown && (
          <select
            style={styles['unitSelect']}
            value={selectedUnit ?? MileageUnit.KM}
            onChange={(e) => onUnitChange?.(e.target.value as MileageUnit)}
          >
            <option value={MileageUnit.KM}>{MileageUnit.KM}</option>
            <option value={MileageUnit.MILES}>{MileageUnit.MILES}</option>
          </select>
        )}
      </div>
      <div style={styles['buttons']}>{buttonContent}</div>
    </div>
  );
};
```

```tsx
export const PhotoCaptureHUDOcrOverlay = (props: PhotoCaptureHUDOcrOverlayProps) => {
  // ...
  return (
    <div>
      <OcrDialog {...dialogProps} />
    </div>
  );
};
```

### No IIFEs in JSX

Bad:

```tsx
{
  ocrConfig &&
    (() => {
      const matchedSight = ocrSights?.find((s) => s.sightId === selectedSight.id);
      return (
        <PhotoCaptureHUDOcrOverlay
          config={ocrConfig}
          isActive={!ocrSights || !!matchedSight}
          mode={matchedSight?.mode}
          defaultMileageUnit={matchedSight?.defaultMileageUnit ?? odometerUnit}
          sightId={selectedSight.id}
        />
      );
    })();
}
```

Good: derive once, in the hook (or before `return`), and keep the JSX flat.

```ts
const matchedOcrSight = ocrSights?.find((sight) => sight.sightId === selectedSight.id);
const isOcrActive = !ocrSights || !!matchedOcrSight;
```

```tsx
{ocrConfig && (
  <PhotoCaptureHUDOcrOverlay
    config={ocrConfig}
    isActive={isOcrActive}
    mode={matchedOcrSight?.mode}
    defaultMileageUnit={matchedOcrSight?.defaultMileageUnit ?? odometerUnit}
    sightId={selectedSight.id}
  />
)}
```

### Move logic from `.tsx` into a hook

Bad:

```tsx
export const UploadStatusBanner = ({ inspectionId }: UploadStatusBannerProps) => {
  const { state } = useMonkState();
  const [isDismissed, setIsDismissed] = useState(false);

  const failedImages = state.images.filter(
    (image) => image.inspectionId === inspectionId && image.status === ImageStatus.UPLOAD_FAILED,
  );

  useEffect(() => {
    if (failedImages.length > 0) {
      setIsDismissed(false);
    }
  }, [failedImages.length]);

  if (isDismissed || failedImages.length === 0) {
    return null;
  }
  return <Banner count={failedImages.length} onDismiss={() => setIsDismissed(true)} />;
};
```

Good:

```ts
// hooks/useUploadStatusBanner.ts
/**
 * Handle returned by the useUploadStatusBanner hook.
 */
export interface UploadStatusBannerHandle {
  /** Number of images that failed to upload. */
  failedCount: number;
  /** Whether the banner should be displayed. */
  isVisible: boolean;
  /** Hides the banner until a new upload fails. */
  dismiss: () => void;
}

/**
 * Tracks failed uploads of an inspection and the visibility of their banner.
 */
export const useUploadStatusBanner = (inspectionId: string): UploadStatusBannerHandle => {
  const { state } = useMonkState();
  const [isDismissed, setIsDismissed] = useState(false);

  const failedCount = useMemo(
    () =>
      state.images.filter(
        (image) =>
          image.inspectionId === inspectionId && image.status === ImageStatus.UPLOAD_FAILED,
      ).length,
    [state.images, inspectionId],
  );

  useEffect(() => {
    if (failedCount > 0) {
      setIsDismissed(false);
    }
  }, [failedCount]);

  const dismiss = useCallback(() => setIsDismissed(true), []);

  return useObjectMemo({ failedCount, isVisible: !isDismissed && failedCount > 0, dismiss });
};
```

```tsx
export const UploadStatusBanner = ({ inspectionId }: UploadStatusBannerProps) => {
  const { failedCount, isVisible, dismiss } = useUploadStatusBanner(inspectionId);

  return isVisible ? <Banner count={failedCount} onDismiss={dismiss} /> : null;
};
```

### Missing barrel export

Bad: `src/PhotoCapture/hooks/useUploadStatusBanner.ts` is added, but `hooks/index.ts` doesn't
re-export it, so consumers deep-import `@monkvision/inspection-capture-web/lib/...`.

Good:

```ts
// src/PhotoCapture/hooks/index.ts
export * from './useUploadStatusBanner';
```
