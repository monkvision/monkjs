# VehicleDetectionPOC

A proof of concept Camera HUD that guides the user into framing a vehicle before taking a picture. It runs
[EfficientDet-Lite0](https://ai.google.dev/edge/mediapipe/solutions/vision/object_detector) through
`@mediapipe/tasks-vision` over the live camera stream at 10 FPS, smooths the detected bounding box, and compares it
to a static target frame to produce a single instruction.

> **This is a POC, not a feature.** It ships without unit tests and without i18n (the instruction strings are English
> constants in `constants.ts`), and it is excluded from the package's coverage thresholds in `jest.config.js`.

## Usage

<!-- eslint-skip -->

```tsx
import { Camera, VehicleDetectionHUD } from '@monkvision/camera-web';

<Camera HUDComponent={VehicleDetectionHUD} hudProps={{ debug: true }} />;
```

The interesting logic is also usable on its own:

<!-- eslint-skip -->

```tsx
const { state, metrics, smoothedBox } = useVehiclePositioning({ videoRef: handle.videoRef });
```

## Serving the model

The `.tflite` model is **not** bundled with this package. `camera-web` is built with plain `tsc`, which does not copy
binary assets into `lib/`, so the model has to be served over HTTP by the host application.

By default the HUD loads:

| Asset        | Default                                                           |
| ------------ | ----------------------------------------------------------------- |
| Model        | `/models/efficientdet_lite0.tflite` (served by the host app)      |
| WASM runtime | `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm` |

Both are overridable via the `modelAssetPath` and `wasmBasePath` props.

For `demo-app`, put the model in `apps/demo-app/public/models/` (there is a `copy:poc-assets` script for this). The
file is gitignored: it is 7MB and would otherwise sit in git history forever.

To work offline, copy `node_modules/@mediapipe/tasks-vision/wasm` somewhere under `public/` and point `wasmBasePath`
at it. Be aware that directory is ~35MB across its three variants.

## How it works

Three stages, each in its own file so the maths can be tuned without touching the render path.

### 1. The inference loop — `hooks/useVehicleDetection.ts`

Capped at 10 FPS via `useInterval`. `detectForVideo` is _synchronous_, so a slow call blocks the main thread and
makes the preview stutter; if a call overruns `INFERENCE_BUDGET_MS` the loop skips ahead, trading frame rate for a
responsive UI.

Frames are downscaled into a private aspect-preserving canvas before inference (`inferenceWidth`, default 512px).
This matters a lot: `Camera` requests a **4K** preview on mobile, and handing the detector an 8.3 megapixel frame ten
times a second — only for it to resize it to 320×320 internally — costs tens of milliseconds per call.

Detections are filtered to `car` / `truck` above a 0.60 score, both natively (via MediaPipe's `categoryAllowlist` and
`scoreThreshold`) and in JS.

### 2. The spatial logic — `utils/geometry.utils.ts`

All the maths runs in normalised `[0, 1]` coordinates relative to the camera frame, which is what keeps the state
machine independent of screen size, device orientation and the downscale factor. CSS pixels only enter the picture
when positioning the overlay.

Three scalars come out of it:

| Metric        | Definition                                                                  |
| ------------- | --------------------------------------------------------------------------- |
| `areaRatio`   | vehicle area / target area                                                  |
| `centerError` | centre offset, per axis, as a fraction of the **target box** dimensions     |
| `overflow`    | worst-axis excursion outside the target, over the smallest target dimension |

`centerError` is normalised by the target rather than by the frame on purpose: normalised frame coordinates are
anisotropic, so a raw euclidean distance would mean different things in portrait and in landscape.

### 3. The state machine — `utils/positioning.utils.ts`

`decideVehiclePositioningState` is a pure, total function of `(metrics, previousState)`. `[0.50, 0.80]` is the area
window to _become_ perfectly framed and `[0.40, 0.90]` the window to _remain_ so — the bands in between are the
hysteresis.

Three independent layers keep the output stable, and all three are load bearing:

1. **EMA** (`utils/ema.utils.ts`) smooths the _geometry_. `alpha = 0.2`, applied to the box centre, with a lower
   factor on its size because box edges jitter harder than centres. The factor is timestep-corrected so the feel does
   not change when the loop skips ticks.
2. **Hysteresis** widens the decision _boundaries_, so the frame cannot flicker at a threshold.
3. **A dwell timer** debounces the discrete _output_, so a single wandering tick cannot flash a new instruction.

Tracking uses IoU continuity rather than the highest score: confidence correlates with how canonical a view of a car
the model sees, not with which car the user cares about, so scoring alone flips between the subject and a parked car
in the background.

## Debug mode

Pass `debug: true`, or tap the invisible 56×56 hotspot in the **top right corner three times** in quick succession.

It draws the raw model output in red, the smoothed box as a dashed cyan rectangle, and a panel with the live metrics
against their thresholds. Watch `inference` in particular — it is the number that decides whether this approach is
viable on a given class of device.

## Known limitations

- **Letterboxing.** The target frame is confined to the rectangle the video actually paints, because containment
  would otherwise be unsatisfiable against pixels the camera never saw. On a portrait phone receiving a landscape
  stream this rectangle can be a thin band; the letterbox bars are dimmed so the active area reads correctly. The
  real fix is to request a preview aspect ratio matching the screen, which means changing `getMediaConstraints`.
- **`navigator.vibrate` does not exist on iOS Safari** — any version. The haptic simply never fires there, which is
  why the perfectly-framed state is also obvious visually.
- **Cold start is ~19MB** (WASM runtime plus model), so 20-40s on a poor connection. The banner shows a loading
  message rather than "no vehicle detected" while that is in flight.
- **Thermal throttling** is the expected steady state, not an edge case: 4K capture plus continuous inference heats a
  phone within minutes, after which iOS throttles both the CPU and the capture frame rate.
- `alpha = 0.2` at 10 FPS has a 0.5s time constant, which is noticeably sluggish. 0.3-0.4 feels better; the defaults
  match the original spec and are exposed as props.
