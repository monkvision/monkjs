import { CenterBox, VehiclePositioningState } from './types';

/**
 * The static target frame the detected vehicle is compared against, in normalized frame coordinates.
 *
 * Note: This box must stay inside `[0, 1]²`, otherwise containment becomes unsatisfiable : no vehicle can ever fill a
 * frame that includes pixels the camera never saw.
 */
export const DEFAULT_TARGET_BOX: CenterBox = {
  xCenter: 0.5,
  yCenter: 0.5,
  width: 0.86,
  height: 0.62,
};

/**
 * The interval between two inference ticks, in milliseconds. 100ms means 10 FPS, which is plenty for human-guided
 * positioning and an order of magnitude cheaper than running on every single video frame.
 */
export const DETECTION_INTERVAL_MS = 100;

/**
 * If an inference call takes longer than this many milliseconds, the loop skips ticks until that much time has
 * elapsed. Since `detectForVideo` is synchronous, a slow call would otherwise saturate the main thread and make the
 * camera preview stutter.
 */
export const INFERENCE_BUDGET_MS = 60;

/**
 * The minimum confidence score a detection must have to be considered. Also passed to MediaPipe directly so the
 * native side does the filtering.
 */
export const MIN_DETECTION_SCORE = 0.6;

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
 * which is why the tracker must never tie a track's identity to its category.
 */
export const VEHICLE_CATEGORY_NAMES = ['car', 'truck'];

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
export const LOSS_GRACE_TICKS = 5;

/**
 * The minimum IoU between a candidate and the currently tracked box for that candidate to be considered the same
 * vehicle.
 */
export const TRACK_IOU_MIN = 0.25;

/**
 * If the newly selected box overlaps the current smoothed box by less than this IoU, the smoothing accumulator is
 * reset instead of being interpolated. Interpolating across a teleport would make the box travel through geometries
 * the vehicle never occupied, emitting a sequence of instructions that never actually applied.
 */
export const JUMP_IOU_MIN = 0.1;

/**
 * How much the confidence score is allowed to weigh when acquiring a new track, relative to the overlap with the
 * target box. Small on purpose : it only breaks ties.
 */
export const SCORE_TIEBREAK_WEIGHT = 0.01;

/**
 * The area ratio window a vehicle must fall into to *become* perfectly framed.
 */
export const AREA_ENTER_MIN = 0.5;

/**
 * The area ratio window a vehicle must fall into to *become* perfectly framed.
 */
export const AREA_ENTER_MAX = 0.8;

/**
 * The wider area ratio window a vehicle must stay within to *remain* perfectly framed. Together with
 * `AREA_ENTER_MIN` this forms the hysteresis band that stops the frame from flickering at the boundary.
 */
export const AREA_EXIT_MIN = 0.4;

/**
 * The wider area ratio window a vehicle must stay within to *remain* perfectly framed. Together with
 * `AREA_ENTER_MAX` this forms the hysteresis band that stops the frame from flickering at the boundary.
 */
export const AREA_EXIT_MAX = 0.9;

/**
 * The maximum center error, in target box units, for the vehicle to *become* centered.
 */
export const CENTER_ENTER = 0.1;

/**
 * The maximum center error, in target box units, for the vehicle to *remain* centered.
 */
export const CENTER_EXIT = 0.15;

/**
 * The maximum overflow outside of the target box, in target box units, for the vehicle to *become* contained. A
 * non-zero tolerance is required : mirrors, antennas and spoilers sit within a pixel of the target edge and a
 * zero-tolerance test would oscillate permanently.
 */
export const CONTAIN_ENTER = 0.02;

/**
 * The maximum overflow outside of the target box, in target box units, for the vehicle to *remain* contained.
 */
export const CONTAIN_EXIT = 0.08;

/**
 * How long, in milliseconds, the enter predicates must hold continuously before the state machine commits to
 * `VehiclePositioningState.PERFECT`. Prevents a single wandering tick from triggering the success feedback.
 */
export const PERFECT_DWELL_MS = 300;

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
 * The corner radius of the target frame, as a fraction of the smallest dimension of the camera frame. Expressed as a
 * ratio because the overlay SVG `viewBox` is in intrinsic camera pixels, which vary from device to device.
 */
export const CORNER_RADIUS_RATIO = 0.03;

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
  [VehiclePositioningState.NO_CAR_DETECTED]: 'Point the camera at a vehicle',
  [VehiclePositioningState.MOVE_CLOSER]: 'Move closer',
  [VehiclePositioningState.MOVE_FURTHER_AWAY]: 'Move back',
  [VehiclePositioningState.CENTER_THE_CAR]: 'Center the vehicle in the frame',
  [VehiclePositioningState.PERFECT]: 'Perfect',
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
 * The colour the smoothed vehicle box is drawn in when debug mode is enabled.
 */
export const DEBUG_SMOOTHED_BOX_COLOR = '#00E5FF';

/**
 * The stroke width, in CSS pixels, of the target frame.
 */
export const TARGET_FRAME_STROKE_PX = 4;

/**
 * The stroke width, in CSS pixels, of the boxes drawn in debug mode.
 */
export const DEBUG_BOX_STROKE_PX = 2;
