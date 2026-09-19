/**
 * The user facing states produced by the vehicle positioning state machine. Each state maps to a single, actionable
 * instruction telling the user how to reposition their device so that the vehicle's height fills the guide band.
 */
export enum VehiclePositioningState {
  /**
   * No vehicle is currently detected in the camera stream (or the detection has been lost for longer than the loss
   * grace period).
   */
  NO_CAR_DETECTED = 'no_car_detected',
  /**
   * A vehicle is detected but it is too small : the user needs to move closer to it.
   */
  MOVE_CLOSER = 'move_closer',
  /**
   * A vehicle is detected but its roof and wheels are both cut off, so the user is too close to see the full height
   * of it : the user needs to move further away.
   */
  MOVE_FURTHER_AWAY = 'move_further_away',
  /**
   * The vehicle fills the band but sits too high, too low or too far to one side : the user needs to aim back at it.
   */
  CENTER_THE_CAR = 'center_the_car',
  /**
   * The vehicle's full height fills the guide band and the camera is on target. During a walkaround this is a state
   * to *hold* while moving, not a one-off verdict : the vehicle's length is expected to overrun the frame.
   */
  PERFECT = 'perfect',
}

/**
 * The status of the underlying MediaPipe object detector.
 */
export enum DetectorStatus {
  /**
   * The WASM runtime and / or the model are still being downloaded and initialized. No inference is running yet.
   */
  LOADING = 'loading',
  /**
   * The detector is initialized and the inference loop is running.
   */
  READY = 'ready',
  /**
   * The detector failed to initialize. No inference will run.
   */
  ERROR = 'error',
}

/**
 * Which backend MediaPipe should use to run the model.
 */
export enum DetectorDelegate {
  /**
   * Run the model on the CPU. Slower than the GPU on paper, but far more reliable on iOS Safari.
   */
  CPU = 'CPU',
  /**
   * Run the model on the GPU using a WebGL context.
   */
  GPU = 'GPU',
  /**
   * Pick the delegate automatically : CPU on iOS (where WebGL contexts are unreliable and aggressively reclaimed),
   * GPU everywhere else.
   */
  AUTO = 'auto',
}

/**
 * An axis aligned box expressed in normalized `[0, 1]` coordinates relative to the camera frame, using its center
 * point and its size.
 *
 * Note: The normalization is anisotropic (x is divided by the frame width and y by the frame height), so distances
 * must never be compared across axes without being re-normalized first. See `getPositioningMetrics`.
 */
export interface CenterBox {
  /**
   * The normalized horizontal position of the center of the box.
   */
  xCenter: number;
  /**
   * The normalized vertical position of the center of the box.
   */
  yCenter: number;
  /**
   * The normalized width of the box.
   */
  width: number;
  /**
   * The normalized height of the box.
   */
  height: number;
}

/**
 * An axis aligned box expressed in normalized `[0, 1]` coordinates relative to the camera frame, using its top-left
 * corner and its size. This is the shape used for containment math and for rendering.
 */
export interface CornerBox {
  /**
   * The normalized horizontal position of the left edge of the box.
   */
  x: number;
  /**
   * The normalized vertical position of the top edge of the box.
   */
  y: number;
  /**
   * The normalized width of the box.
   */
  width: number;
  /**
   * The normalized height of the box.
   */
  height: number;
}

/**
 * A vehicle detected by the model, in normalized frame coordinates.
 */
export interface VehicleDetection {
  /**
   * The bounding box of the detected vehicle.
   */
  box: CenterBox;
  /**
   * The confidence score of the detection, between 0 and 1.
   */
  score: number;
  /**
   * The category name given by the model, for instance `car` or `truck`.
   */
  categoryName: string;
}

/**
 * The rectangle actually painted by a video element, expressed in CSS pixels relative to a positioning ancestor.
 *
 * Video elements are displayed using `object-fit: contain`, which means the painted frames are letterboxed inside the
 * element's box. This rectangle describes where those frames really are, and is what the SVG overlay is sized to.
 */
export interface VideoContentRect {
  /**
   * The horizontal offset of the painted frames relative to the positioning ancestor, in CSS pixels.
   */
  offsetX: number;
  /**
   * The vertical offset of the painted frames relative to the positioning ancestor, in CSS pixels.
   */
  offsetY: number;
  /**
   * The width of the painted frames, in CSS pixels.
   */
  width: number;
  /**
   * The height of the painted frames, in CSS pixels.
   */
  height: number;
  /**
   * The intrinsic width of the camera frames, in pixels. Used as the width of the overlay SVG `viewBox`.
   */
  frameWidth: number;
  /**
   * The intrinsic height of the camera frames, in pixels. Used as the height of the overlay SVG `viewBox`.
   */
  frameHeight: number;
}

/**
 * The geometric comparison between the smoothed vehicle box and the guide band. These scalars and flags are the only
 * inputs of the positioning state machine.
 *
 * Note: Nothing here measures the vehicle's *width*, on purpose. See `VERTICAL_BAND_HEIGHT` for why a walkaround
 * cannot require the vehicle to fit inside the frame horizontally.
 */
export interface PositioningMetrics {
  /**
   * How much of the guide band the vehicle's height fills. A value of `1` means the vehicle spans the band exactly.
   * This is the distance signal, and it is viewpoint-invariant because a vehicle is the same height from every angle.
   */
  verticalFill: number;
  /**
   * How far the center of the vehicle box is from the vertical center of the frame, as a fraction of the band height.
   * This is what distinguishes a camera tilted up or down from one at the wrong distance.
   */
  verticalCenterError: number;
  /**
   * How far the center of the vehicle box is from the horizontal center of the frame, in frame width units. Only used
   * to catch the camera drifting off the vehicle entirely, never to judge how much of the vehicle is visible.
   */
  horizontalCenterError: number;
  /**
   * Whether the vehicle box reaches the top edge of the frame, meaning the roof is cut off.
   */
  isTopClipped: boolean;
  /**
   * Whether the vehicle box reaches the bottom edge of the frame, meaning the wheels are cut off.
   */
  isBottomClipped: boolean;
}

/**
 * The result returned by the useVehiclePositioning hook.
 */
export interface VehiclePositioningResult {
  /**
   * The current user facing positioning state.
   */
  state: VehiclePositioningState;
  /**
   * The status of the underlying object detector. While this is not `DetectorStatus.READY`, the `state` value is not
   * meaningful yet and the UI should display a loading indicator instead of an instruction.
   */
  detectorStatus: DetectorStatus;
  /**
   * The delegate the detector actually ended up running on, or null while it is still loading.
   */
  delegate: DetectorDelegate.CPU | DetectorDelegate.GPU | null;
  /**
   * The EMA-smoothed vehicle box, or null if no vehicle is currently tracked.
   */
  smoothedBox: CenterBox | null;
  /**
   * The raw, unsmoothed detections of the last inference tick. Only populated when debug mode is enabled.
   */
  rawDetections: VehicleDetection[];
  /**
   * The live positioning metrics, or null if no vehicle is currently tracked.
   */
  metrics: PositioningMetrics | null;
  /**
   * The guide band the vehicle height is compared against, in normalized frame coordinates, or null until the stream
   * has reported its intrinsic dimensions (the band depends on the frame's aspect ratio).
   */
  guideBox: CenterBox | null;
  /**
   * How long the last inference call took, in milliseconds. Exposed for the debug panel : this is the single most
   * useful number to watch when evaluating whether this approach is viable on a given device.
   */
  inferenceMs: number;
  /**
   * The number of vehicle candidates returned by the last inference tick, after filtering.
   */
  candidateCount: number;
}
