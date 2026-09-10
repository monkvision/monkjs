# @monkvision/ml-web

On-device machine-learning inference for React web apps, powered by [ONNX Runtime WebAssembly](https://onnxruntime.ai/).

## Overview

This package provides the OCR (Optical Character Recognition) primitives used by `@monkvision/inspection-capture-web` to read vehicle identifiers (VIN, odometer) directly from the camera feed — without any server round-trip.

Inference runs inside a **Web Worker** so the main thread stays unblocked. The worker is created automatically when you call `useOcr`.

## Usage

```tsx
import { useOcr, OCR_MODEL_URLS, OCR_STABILIZER_CONFIG, OCR_WORKER_URL } from '@monkvision/ml-web';

function MyComponent() {
  const { isReady, loadModels, processFrame, confirmedText, reset } = useOcr({
    ...OCR_MODEL_URLS,
    workerUrl: OCR_WORKER_URL,
    appearanceCount: OCR_STABILIZER_CONFIG.appearanceCount,
  });

  useEffect(() => { loadModels(); }, [loadModels]);

  // Call processFrame(imageData) on a interval to feed camera frames.
  // confirmedText is non-null once enough consistent readings accumulate.
}
```

## Architecture

```
useOcr (React hook)
  └─ Web Worker (ocr.worker.ts)
       ├─ ONNX Runtime WASM  ← loaded from wasmBaseUrl (jsDelivr CDN by default)
       ├─ Recognition model  ← loaded from recModelUrl
       └─ Character dict     ← loaded from dictUrl
```

The hook communicates with the worker via `postMessage`. Frames are transferred (zero-copy) using `ArrayBuffer` transfer. The stabilizer inside `useOcr` counts consecutive similar readings (Levenshtein distance ≤ `fuzzyTolerance`) and sets `confirmedText` once `appearanceCount` is reached.

## API

### `useOcr(config: UseOcrConfig): UseOcrResult`

| Config field | Type | Default | Description |
|---|---|---|---|
| `workerUrl` | `string` | — | URL of the compiled Web Worker script — use `OCR_WORKER_URL` for the default |
| `recModelUrl` | `string` | — | URL of the ONNX recognition model |
| `dictUrl` | `string` | — | URL of the character dictionary (one char per line) |
| `wasmBaseUrl` | `string` | jsDelivr CDN | Base URL for ONNX Runtime WASM files |
| `appearanceCount` | `number` | `3` | Consecutive reads needed to confirm text |
| `fuzzyTolerance` | `number` | `1` | Max Levenshtein distance to count as the same reading |

### `UseOcrResult`

| Field | Type | Description |
|---|---|---|
| `isReady` | `boolean` | True once models are loaded and frames can be processed |
| `isLoading` | `boolean` | True while models are loading |
| `isInferring` | `boolean` | True while a frame inference is in flight |
| `fatalError` | `string \| null` | Set when the worker crashes; hook is unusable until remounted |
| `confirmedText` | `string \| null` | Non-null once `appearanceCount` consistent readings accumulate |
| `detectedText` | `string` | Raw text from the last processed frame |
| `chars` | `OcrCharResult[]` | Per-character results (char + confidence) from the last frame |
| `consistencyCount` | `number` | Consecutive consistent readings so far |
| `loadModels` | `() => void` | Triggers model loading; no-op if already loading or ready |
| `unloadModels` | `() => void` | Terminates and restarts the worker, freeing model memory |
| `processFrame` | `(imageData: ImageData) => void` | Submits a frame for inference; ignored while another is in flight |
| `reset` | `() => void` | Clears stabilizer state so the hook can confirm a new reading |

### `OCR_WORKER_URL`

Bundler-resolved URL of the compiled OCR Web Worker script (`ocr.worker.js`). Pass this as
`workerUrl` in `UseOcrConfig` to use the default worker. The URL is computed with
`new URL('./ocr.worker.js', import.meta.url)` so your bundler (Vite, Webpack, etc.) will
automatically bundle and chunk the worker file.

### `OCR_MODEL_URLS`

Pre-configured URLs pointing to Monk's public GCS bucket (recognition model + dictionary).

### `OCR_STABILIZER_CONFIG`

Default stabilizer settings (`appearanceCount`, `fuzzyTolerance`, `captureIntervalMs`).
