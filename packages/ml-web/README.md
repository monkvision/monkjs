# @monkvision/ml-web

On-device machine-learning inference for React web apps, powered by [ONNX Runtime WebAssembly](https://onnxruntime.ai/).

## Overview

This package provides the OCR (Optical Character Recognition) primitives used by `@monkvision/inspection-capture-web` to read vehicle identifiers (VIN, odometer) directly from the camera feed — without any server round-trip.

Inference runs inside a **Web Worker** so the main thread stays unblocked. The worker is created automatically when you call `useOcr`.

## Usage

```tsx
import { useOcr, OCR_MODEL_URLS, OCR_STABILIZER_CONFIG } from '@monkvision/ml-web';

function MyComponent() {
  const { isReady, loadModels, processFrame, confirmedText, reset } = useOcr({
    ...OCR_MODEL_URLS,
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
| `recModelUrl` | `string` | — | URL of the ONNX recognition model |
| `dictUrl` | `string` | — | URL of the character dictionary (one char per line) |
| `wasmBaseUrl` | `string` | jsDelivr CDN | Base URL for ONNX Runtime WASM files |
| `appearanceCount` | `number` | `3` | Consecutive reads needed to confirm text |
| `fuzzyTolerance` | `number` | `1` | Max Levenshtein distance to count as the same reading |

### `OCR_MODEL_URLS`

Pre-configured URLs pointing to Monk's public GCS bucket (recognition model + dictionary).

### `OCR_STABILIZER_CONFIG`

Default stabilizer settings (`appearanceCount`, `fuzzyTolerance`, `captureIntervalMs`).
