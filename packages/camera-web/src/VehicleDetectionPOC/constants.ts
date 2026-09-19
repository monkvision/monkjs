import { VehiclePositioningState } from './types';

/**
 * The height of the guide band, expressed as a fraction of the *narrow* field of view of the camera.
 *
 * A walkaround is a continuous capture at a roughly constant radius, and at a constant radius a vehicle simply cannot
 * stay fully in frame: its apparent length nearly triples between a head-on view (~1.8m) and a broadside view
 * (~4.5m), while its height stays ~1.5m from every angle. Demanding containment therefore forces the user to stand
 * far enough back for the broadside view to fit, at which point the head-on view wastes most of the frame and
 * resolves no damage.
 *
 * So the vehicle's *height* is the distance reference and its length is allowed to overrun the frame freely. This
 * constant is the band that height should fill.
 *
 * Note: Expressed against the narrow field of view, not against the frame height, so that it means the same thing in
 * both orientations. See `getShortAxisScaleY`.
 */
export const VERTICAL_BAND_HEIGHT = 0.84;

/**
 * How much of the frame width is reserved as a margin on each side of the guide band, for drawing only. The band is
 * deliberately open at the sides: nothing about the horizontal axis is ever judged against it.
 */
export const HORIZONTAL_INSET = 0.06;

/**
 * How close, in normalized frame units, a box edge has to be to a frame edge to count as clipped by it.
 *
 * Note: Detections are clamped into `[0, 1]²`, so a vehicle extending past the frame and a vehicle ending exactly at
 * the frame edge are indistinguishable by the time they get here. That conflation is harmless: both mean "there is no
 * visible margin left on this side".
 */
export const EDGE_CLIP_EPSILON = 0.005;

/**
 * The interval between two inference ticks, in milliseconds.
 *
 * Note: 150ms means ~6.7 FPS, which is plenty for human-guided positioning. It is deliberately slower than the 10 FPS
 * a standalone camera screen could afford, because VideoCapture already runs a 200ms screenshot loop and a 1s
 * Laplacian sharpness pass over full resolution frames on the same main thread.
 */
export const DETECTION_INTERVAL_MS = 150;

/**
 * If an inference call takes longer than this many milliseconds, the loop skips ticks until that much time has
 * elapsed. Since `detectForVideo` is synchronous, a slow call would otherwise saturate the main thread and make the
 * camera preview stutter.
 */
export const INFERENCE_BUDGET_MS = 60;

/**
 * The minimum confidence score a detection must have to be considered. Also passed to MediaPipe directly so the
 * native side does the filtering.
 *
 * Note: Kept deliberately low. EfficientDet-Lite0 is confident about the canonical three-quarter view it saw most
 * often during training, and much less so about a head-on rear view or a close-up that crops the wheels, which are
 * both extremely common during a walkaround. A higher threshold does not filter out false positives here so much as
 * it filters out the viewpoints this feature exists to support.
 */
export const MIN_DETECTION_SCORE = 0.35;

/**
 * The maximum number of detections requested from the model. More than one is required so that the tracker can pick
 * the right vehicle when several are in frame.
 */
export const MAX_DETECTION_RESULTS = 5;

/**
 * The COCO category names considered to be a vehicle.
 *
 * Note: COCO has `car`, `truck` and `bus` as separate classes and has no `van` or `suv` class. An SUV usually
 * classifies as `car` and a pickup as `truck`, sometimes alternating between the two from one frame to the next,
 * which is why the tracker must never tie a track's identity to its category. `bus` is included because a van, a
 * minibus or a large SUV filling most of the frame regularly lands there.
 */
export const VEHICLE_CATEGORY_NAMES = ['car', 'truck', 'bus'];

/**
 * The width, in pixels, of the offscreen canvas the video frames are downscaled into before being given to the model.
 *
 * The Camera component requests a 4K preview on mobile devices. Handing a 3840x2160 frame to the detector ten times a
 * second, synchronously, only for it to resize it to 320x320 internally, costs tens of milliseconds per call. The
 * downscale is a single GPU-accelerated `drawImage` and makes the inference cost essentially resolution independent.
 *
 * The canvas preserves the source aspect ratio : squashing it would distort the vehicles and measurably degrade
 * detection quality.
 */
export const DEFAULT_INFERENCE_WIDTH = 512;

/**
 * The smoothing factor applied to the position (center) of the vehicle box on every tick.
 */
export const EMA_ALPHA_POSITION = 0.2;

/**
 * The smoothing factor applied to the size of the vehicle box on every tick. Lower than the position factor because
 * the edges of a bounding box jitter harder than its center (mirrors, shadows, partial occlusions).
 */
export const EMA_ALPHA_SIZE = 0.15;

/**
 * The number of consecutive inference ticks without a detection that are tolerated before the tracked vehicle is
 * considered lost. Below this threshold the last known box and state are held, because a single dropped frame (motion
 * blur, a bad exposure) is very common and must not make the UI flash.
 */
export const LOSS_GRACE_TICKS = 8;

/**
 * The minimum IoU between a candidate and the currently tracked box for that candidate to be considered the same
 * vehicle.
 *
 * Note: Low on purpose. During a walkaround the vehicle sweeps across the frame and changes apparent shape between
 * two ticks, so demanding a large overlap drops the track and restarts the smoothing from scratch several times per
 * revolution. There is rarely more than one vehicle in frame anyway, so the cost of being wrong here is small.
 */
export const TRACK_IOU_MIN = 0.15;

/**
 * If the newly selected box overlaps the current smoothed box by less than this IoU, the smoothing accumulator is
 * reset instead of being interpolated. Interpolating across a teleport would make the box travel through geometries
 * the vehicle never occupied, emitting a sequence of instructions that never actually applied.
 */
export const JUMP_IOU_MIN = 0.1;

/**
 * How much the confidence score is allowed to weigh when acquiring a new track, relative to the overlap with the
 * guide band. Small on purpose : it only breaks ties.
 */
export const SCORE_TIEBREAK_WEIGHT = 0.01;

/**
 * The minimum share of the guide band the vehicle's height must fill for the framing to *become* good.
 *
 * This is the knob that sets the working distance, and it is the only one that does. For a 1.5m tall vehicle and a
 * 50 degree narrow field of view it works out at roughly:
 *
 * | Vertical fill | Distance |
 * | ------------- | -------- |
 * | 0.50          | 4.0m     |
 * | 0.58          | 3.5m     |
 * | 0.68          | 3.0m     |
 * | 0.80          | 2.5m     |
 * | 1.00          | 2.0m     |
 *
 * The relationship is monotonic — a higher threshold always means "stand closer" — so tuning this needs no knowledge
 * of the device's optics, but the distances above scale with the actual field of view.
 *
 * Note: There is deliberately no upper bound. A vertical fill above 1 means the vehicle is taller than the band,
 * which is not an error as long as its roof and wheels are both still visible — and once they are not, the vehicle
 * box necessarily spans the whole frame height, so the clipping rule catches it exactly. An upper threshold here
 * would be a second, redundant and less precise "too close" signal.
 */
export const VERTICAL_FILL_ENTER_MIN = 0.68;

/**
 * The lower vertical fill the vehicle must stay above for the framing to *remain* good. Together with
 * `VERTICAL_FILL_ENTER_MIN` this forms the hysteresis band that stops the state from flickering at the boundary.
 */
export const VERTICAL_FILL_EXIT_MIN = 0.58;

/**
 * The maximum vertical center error, in band units, for the vehicle to *become* vertically centered. This is what
 * catches a camera tilted too far up or down, which cuts the roof or the wheels off one side at a time.
 */
export const VERTICAL_CENTER_ENTER = 0.25;

/**
 * The maximum vertical center error, in band units, for the vehicle to *remain* vertically centered.
 */
export const VERTICAL_CENTER_EXIT = 0.35;

/**
 * The maximum horizontal center error, in frame width units, for the vehicle to *become* on target.
 *
 * Note: Loose on purpose, and it is not a framing rule. During a walkaround the vehicle legitimately fills the frame
 * edge to edge, so nothing here judges how much of it is visible. This threshold only catches the camera drifting off
 * the vehicle altogether — pointing at the driveway next to it rather than at the vehicle.
 */
export const HORIZONTAL_CENTER_ENTER = 0.28;

/**
 * The maximum horizontal center error, in frame width units, for the vehicle to *remain* on target.
 */
export const HORIZONTAL_CENTER_EXIT = 0.35;

/**
 * How long, in milliseconds, the enter predicates must hold continuously before the state machine commits to
 * `VehiclePositioningState.PERFECT`. Prevents a single wandering tick from triggering the success feedback.
 */
export const PERFECT_DWELL_MS = 250;

/**
 * How long, in milliseconds, a state is held before a different one is allowed to replace it. This debounces the
 * discrete output, which neither the EMA (which smooths geometry) nor the hysteresis (which widens the boundaries)
 * can do on their own.
 */
export const MIN_STATE_DURATION_MS = 350;

/**
 * The minimum delay, in milliseconds, between two haptic feedbacks.
 */
export const VIBRATE_COOLDOWN_MS = 1500;

/**
 * The duration, in milliseconds, of the haptic feedback fired when the vehicle becomes perfectly framed.
 */
export const VIBRATE_DURATION_MS = 50;

/**
 * The length of the inward end caps of the guide band lines, as a fraction of the smallest dimension of the camera
 * frame. Expressed as a ratio because the overlay SVG `viewBox` is in intrinsic camera pixels, which vary from device
 * to device.
 */
export const BAND_CAP_RATIO = 0.05;

/**
 * The number of taps on the hidden hotspot required to toggle debug mode.
 */
export const DEBUG_TOGGLE_TAP_COUNT = 3;

/**
 * The maximum delay, in milliseconds, between two taps for them to count towards the debug mode toggle.
 */
export const DEBUG_TOGGLE_TAP_DELAY_MS = 600;

/**
 * The default location of the EfficientDet-Lite0 model. This file is not shipped inside the package (a `tsc` build
 * does not copy binary assets into `lib`), it has to be served by the host application.
 */
export const DEFAULT_MODEL_ASSET_PATH = '/models/efficientdet_lite0.tflite';

/**
 * The default location of the MediaPipe vision WASM runtime, pinned to the installed version so that it is immutably
 * cacheable. Serving it from a CDN avoids committing ~23MB of WASM binaries into the repository.
 */
export const DEFAULT_WASM_BASE_PATH =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm';

/**
 * The user facing instruction displayed for each positioning state.
 *
 * Note: This POC deliberately does not go through i18n. Translations would need to be added to all 17 locale files of
 * the package before this can ship as a real feature.
 */
export const POSITIONING_INSTRUCTIONS: Record<VehiclePositioningState, string> = {
  [VehiclePositioningState.NO_CAR_DETECTED]: 'Point the camera at the vehicle',
  [VehiclePositioningState.MOVE_CLOSER]: 'Move closer',
  [VehiclePositioningState.MOVE_FURTHER_AWAY]: 'Move back',
  [VehiclePositioningState.CENTER_THE_CAR]: 'Fit the vehicle between the lines',
  // Phrased as a continuous instruction rather than a verdict: unlike a single shot, a good walkaround framing is a
  // state the user has to hold while they keep moving.
  [VehiclePositioningState.PERFECT]: 'Good — keep moving around the vehicle',
};

/**
 * The message displayed while the WASM runtime and the model are still being downloaded.
 */
export const DETECTOR_LOADING_MESSAGE = 'Preparing vehicle detection…';

/**
 * The message displayed when the detector failed to initialize.
 */
export const DETECTOR_ERROR_MESSAGE = 'Vehicle detection unavailable';

/**
 * The colour the unsmoothed model output is drawn in when debug mode is enabled. Hardcoded rather than taken from the
 * theme because it must stay recognisable as "this is raw debug data" whatever palette the host application uses.
 */
export const DEBUG_RAW_BOX_COLOR = '#FF453A';

/**
 * The stroke width, in CSS pixels, of the guide band lines.
 */
export const BAND_STROKE_PX = 5;

/**
 * The stroke width, in CSS pixels, of the tracked vehicle box.
 */
export const VEHICLE_BOX_STROKE_PX = 3;

/**
 * The stroke width, in CSS pixels, of the boxes drawn in debug mode.
 */
export const DEBUG_BOX_STROKE_PX = 2;
