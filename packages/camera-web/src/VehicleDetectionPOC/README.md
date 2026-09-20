# VehicleDetectionPOC

A proof of concept overlay that guides the user through a vehicle **walkaround** in real time. It runs
[EfficientDet-Lite0](https://ai.google.dev/edge/mediapipe/solutions/vision/object_detector) through
`@mediapipe/tasks-vision` over the live camera stream, smooths the detected bounding box, and checks that its **top
and bottom edges** reach a pair of guide lines to produce a single instruction.

It judges the vertical axis rather than containment on purpose: during a walkaround the vehicle's length is _expected_
to overrun the frame, and requiring it to fit would force the user too far back to resolve damage. See
[Why only the vehicle's height is judged](#why-only-the-vehicles-height-is-judged) and
[Why the box's edges are tested, not its height](#why-the-boxs-edges-are-tested-not-its-height).

> **This is a POC, not a feature.** It ships without unit tests and without i18n (the instruction strings are English
> constants in `constants.ts`), and it is excluded from the package's coverage thresholds in `jest.config.js`.

## Usage

This is an _addition on top of_ `Camera`, not a HUD. It renders no camera preview, consumes no pointer events, and
needs nothing but the video element from the Camera handle, so it composes with whatever HUD the host already uses.
Render it inside a positioned ancestor covering the preview, **after** any interactive HUD layer:

<!-- eslint-skip -->

```tsx
import { VehicleDetectionOverlay } from '@monkvision/camera-web';

<div style={{ position: 'relative' }}>
  {cameraPreview}
  <MyExistingHud />
  <VehicleDetectionOverlay videoRef={handle.videoRef} />
</div>;
```

Ordering matters only for the debug hotspot: the overlay is `pointer-events: none` throughout so it never steals a
tap, but the hidden hotspot has to sit above the HUD to be reachable.

`VideoCaptureHUD` in `@monkvision/inspection-capture-web` wires it exactly this way, and unmounts it outside the
recording screen so the inference loop stops once there is nothing left to guide.

The logic is also usable on its own, without any of the rendering:

<!-- eslint-skip -->

```tsx
const { state, metrics, smoothedBox } = useVehiclePositioning({ videoRef: handle.videoRef });
```

## Serving the model

The `.tflite` model is **not** bundled with this package. `camera-web` is built with plain `tsc`, which does not copy
binary assets into `lib/`, so the model has to be served over HTTP by the host application.

By default the overlay loads:

| Asset        | Default                                                           |
| ------------ | ----------------------------------------------------------------- |
| Model        | `/models/efficientdet_lite0.tflite` (served by the host app)      |
| WASM runtime | `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm` |

Both are overridable via the `modelAssetPath` and `wasmBasePath` props.

For `demo-app-video`, run `yarn workspace monk-demo-app-video copy:poc-assets` to drop the model into
`apps/demo-app-video/public/models/`. The file is gitignored: it is 7MB and would otherwise sit in git history
forever.

To work offline, copy `node_modules/@mediapipe/tasks-vision/wasm` somewhere under `public/` and point `wasmBasePath`
at it. Be aware that directory is ~35MB across its three variants.

## How it works

Three stages, each in its own file so the maths can be tuned without touching the render path.

### 1. The inference loop — `hooks/useVehicleDetection.ts`

Capped at `DETECTION_INTERVAL_MS` via `useInterval`. `detectForVideo` is _synchronous_, so a slow call blocks the main
thread and makes the preview stutter; if a call overruns `INFERENCE_BUDGET_MS` the loop skips ahead, trading frame
rate for a responsive UI. The interval is deliberately slower than a standalone camera screen would need, because
`VideoCapture` already runs a 200ms screenshot loop and a 1s Laplacian sharpness pass on the same main thread.

Frames are downscaled into a private aspect-preserving canvas before inference (`inferenceWidth`, default 512px).
This matters a lot: `Camera` requests a **4K** preview on mobile, and handing the detector an 8.3 megapixel frame
several times a second — only for it to resize it to 320×320 internally — costs tens of milliseconds per call.

Detections are filtered to `car` / `truck` / `bus` above `MIN_DETECTION_SCORE`, both natively (via MediaPipe's
`categoryAllowlist` and `scoreThreshold`) and in JS. That threshold is low on purpose: the model is confident about
the canonical three-quarter view it saw most during training and much less so about a head-on rear view or a close-up
that crops the wheels, which are both unavoidable during a walkaround.

### 2. The spatial logic — `utils/geometry.utils.ts`

All the maths runs in normalised `[0, 1]` coordinates relative to the camera frame, which is what keeps the state
machine independent of screen size, device orientation and the downscale factor. CSS pixels only enter the picture
when positioning the overlay.

#### Why only the vehicle's height is judged

This is the central decision of the whole feature, and it follows from what a walkaround physically **is**: a
continuous capture at a roughly constant radius.

At a constant radius, a vehicle's apparent **length** nearly triples between a head-on view (~1.8m of width) and a
broadside view (~4.5m), while its **height** stays ~1.5m from every angle. So any rule requiring the vehicle to fit
inside the frame is unsatisfiable at the sides unless the user stands far enough back for the broadside view to fit —
at which point the head-on views waste most of the frame and resolve no damage. Containment and a useful capture
distance are simply incompatible during a walkaround.

Height has no such problem. Because it is viewpoint-invariant, one band covers every angle at a fixed radius. So the
vehicle is compared to a **guide band**, and its length is allowed to overrun the frame freely:

| Metric                  | Definition                                                             |
| ----------------------- | ---------------------------------------------------------------------- |
| `topGap`                | gap from the box's top edge to the top guide line, ÷ band height       |
| `bottomGap`             | gap from the box's bottom edge to the bottom guide line, ÷ band height |
| `verticalFill`          | vehicle height ÷ band height, in narrow-FOV units — informational only |
| `horizontalCenterError` | horizontal centre offset, in frame width units                         |
| `isTopClipped`          | the roof has left the frame                                            |
| `isBottomClipped`       | the wheels have left the frame                                         |

Nothing measures the vehicle's width. `horizontalCenterError` is **not** a framing rule and is deliberately loose: it
only catches the camera drifting off the vehicle altogether, never how much of the vehicle is visible.

Simulating a 0→90° sweep at a 2m radius, both gaps hold constant the whole way round while the box width grows past
1.27 — that is, the vehicle overruns the frame by 27% at broadside and the state stays good, which is the entire
point.

#### Why the box's edges are tested, not its height

A height-only test cannot tell scale. A wing mirror at arm's length produces a box whose height is arithmetically
identical to a whole vehicle at 2.5m, so a rule of the form `verticalFill >= x` declares it well framed — which it
did, until this test replaced it. What separates the two is _where the box sits_: the mirror floats mid-frame with a
gap above and below it, while a well-framed vehicle reaches both guide lines.

So `topGap` and `bottomGap` must **each** be within `EDGE_GAP_ENTER`. Both are clamped at zero, so a vehicle taller
than the band reads as no gap rather than a negative one — overshooting a line stays fine right up until the vehicle
clips the frame. Testing the two edges separately is also strictly stronger than a height test plus a centring test,
because it rejects a tall box shifted to one side, so `verticalCenterError` was dropped as redundant.

#### Why the band is measured against the narrow field of view

Normalised coordinates divide y by the frame height, so a given physical height reads differently in portrait and in
landscape: rotating the device swaps which image axis maps to the narrow field of view. The narrow FOV is a fixed
property of the lens, and pixels-per-degree is equal on both axes for square pixels, so `min(width, height)` is
always the axis spanning it. Scaling by `height / min(width, height)` (`getShortAxisScaleY`) therefore turns a
normalised height into the fraction of the narrow FOV it subtends — a quantity that depends only on distance, never
on how the phone is held.

The band is defined in those units too, so in normalised coordinates it shrinks in portrait and grows in landscape.
`getGuideBox` is called by both the metrics and the overlay, so what is measured and what is drawn cannot drift apart.

### 3. The state machine — `utils/positioning.utils.ts`

`decideVehiclePositioningState` is a pure, total function of `(metrics, previousState)`. `0.10` is the worst edge gap
to _become_ well framed and `0.13` the one to _remain_ so — the band in between is the hysteresis.

**The two gaps are read differently, and that is what makes the instructions useful.** Room on _both_ sides
(`min(topGap, bottomGap)`) means the vehicle is small inside the band, so it is simply too far → "Move closer". Room
on only _one_ side (`max(…)`) means the camera is tilted, or the box is a part of the vehicle rather than the whole
of it → the neutral "Fit the vehicle between the lines", which states the goal rather than guessing a direction.

**"Too close" is not a size threshold.** It is `(isTopClipped || isBottomClipped) && worstGap <= 0`: an edge has left
the frame and neither edge still has room, so the vehicle is taller than the frame. Both halves are load bearing.
Requiring _both_ edges to be clipped misses the vehicle overrunning the top while its bottom sits past the lower
line. Requiring merely _one_ clipped edge would punish a camera tilted down at a vehicle that does fit, which is an
aiming error and is handled separately. It is also why there is no `verticalFill` maximum — this test is exact where
a size threshold would be approximate.

With a ~50° narrow FOV this puts the usable range at roughly **1.6m to 2.4m**, at every angle and in both
orientations. `EDGE_GAP_ENTER` is the single knob that sets the far end of that range, and its ts-doc carries the
gap-to-distance table; the near end is fixed by the vehicle outgrowing the frame.

Three independent layers keep the output stable, and all three are load bearing:

1. **EMA** (`utils/ema.utils.ts`) smooths the _geometry_. `alpha = 0.2`, applied to the box centre, with a lower
   factor on its size because box edges jitter harder than centres. The factor is timestep-corrected so the feel does
   not change when the loop skips ticks.
2. **Hysteresis** widens the decision _boundaries_, so the state cannot flicker at a threshold.
3. **A dwell timer** debounces the discrete _output_, so a single wandering tick cannot flash a new instruction.

Tracking uses IoU continuity rather than the highest score: confidence correlates with how canonical a view of a car
the model sees, not with which car the user cares about, so scoring alone flips between the subject and a parked car
in the background. `TRACK_IOU_MIN` is low because during a walkaround the vehicle sweeps across the frame and changes
apparent shape between two ticks.

## What is drawn

Two horizontal band lines with short inward end caps, plus the tracked vehicle box as a dashed rectangle. Both share
one colour, from the theme: grey when nothing is detected, amber while the framing needs work, green once the vehicle
is well framed.

The band is deliberately **open at the sides**, with no vertical stroke joining the two lines, because that is exactly
what the rule says: fit the vehicle's height between the lines and ignore its length. A closed rectangle would promise
the opposite and send the user walking backwards at every broadside angle — which is precisely the bug this design
replaced.

## Debug mode

Pass `debug: true`, or tap the invisible 56×56 hotspot in the **top right corner three times** in quick succession.

It adds the raw model output in red and a panel with the live metrics against their thresholds. Watch `inference` in
particular — it is the number that decides whether this approach is viable on a given class of device.

## Known limitations

- **Letterboxing.** The guide band is confined to the rectangle the video actually paints, since nothing outside it
  was ever seen by the camera. On a portrait phone receiving a landscape stream that rectangle can be a thin strip;
  the letterbox bars are dimmed so the active area reads correctly. The real fix is to request a preview aspect ratio
  matching the screen, which means changing `getMediaConstraints`.
- **A bounding box carries no scale.** The edge test rejects the common close-up cases, but a vehicle part whose box
  happens to span the guide band almost exactly will still pass, and inside the hysteresis band a part can hold a
  good framing it already had. Nothing client-side in this monorepo can close that gap: `vehicle_fully_in_frame` and
  `image_analysis.zoom` exist only in the Monk API response (`packages/network/src/api/models/compliance.ts`) and
  need a full image upload, so they are unusable per frame. Wheel detection would give a true scale reference — a
  wheel is ~0.65m across from every exterior angle — and the existing detector loop, downscale canvas, EMA and dwell
  timer would all be reusable for a second model.
- **"Move closer" can point the wrong way at very close range.** When both gaps are large the geometry is identical
  whether the vehicle is far away or only a part of it is in view, so the instruction assumes the far case, which is
  the one users actually hit. Standing 30cm from a mirror therefore reads "Move closer" — wrong, but it no longer
  reads as well framed, which was the bug.
- **`navigator.vibrate` does not exist on iOS Safari** — any version. The haptic simply never fires there, which is
  why the well-framed state is also obvious visually, on both the band and the vehicle box.
- **Cold start is ~19MB** (WASM runtime plus model), so 20-40s on a poor connection. The banner shows a loading
  message rather than "no vehicle detected" while that is in flight.
- **Thermal throttling** is the expected steady state, not an edge case: 4K capture plus continuous inference heats a
  phone within minutes, after which iOS throttles both the CPU and the capture frame rate. Inside `VideoCapture` this
  runs alongside the existing screenshot and frame-selection loops, so it is the first thing to turn down if the
  preview stutters — raise `DETECTION_INTERVAL_MS` or lower `inferenceWidth`, both exposed as props.
- `@mediapipe/tasks-vision` sits in this package's `dependencies` and the POC is re-exported from `src/index.ts`, so
  every consumer of `@monkvision/camera-web` pulls it in whether or not they use the overlay. Acceptable for a POC,
  not for a release.
- `useVideoContentRect` assigns `objectFit` / `objectPosition` / padding / border onto the Camera's `<video>` element
  from the outside. Those are the UA defaults, so it is a no-op in practice, but it belongs in `Camera.styles.ts` if
  this is ever promoted.
- `alpha = 0.2` has a noticeably sluggish time constant. 0.3-0.4 feels better; the defaults match the original spec
  and are exposed as props.
