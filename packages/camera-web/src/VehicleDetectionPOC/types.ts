/**
 * The user facing states produced by the vehicle positioning state machine. Each state maps to a single, actionable
 * instruction telling the user how to reposition their device so that the vehicle fills the target frame.
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
   * A vehicle is detected but it is too big (or it does not fit inside the target frame) : the user needs to move
   * further away from it.
   */
  MOVE_FURTHER_AWAY = 'move_further_away',
  /**
   * The vehicle has roughly the right size but it is not properly aligned with the target frame : the user needs to
   * center it.
   */
  CENTER_THE_CAR = 'center_the_car',
  /**
   * The vehicle is contained in the target frame, properly centered and at the right distance : the user can take the
   * picture.
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
 * The geometric comparison between the smoothed vehicle box and the static target frame. These three scalars are the
 * only inputs of the positioning state machine.
 */
export interface PositioningMetrics {
  /**
   * The ratio between the area of the vehicle box and the area of the target box. This value is invariant under the
   * anisotropic normalization of the frame coordinates.
   */
  areaRatio: number;
  /**
   * How far the center of the vehicle box is from the center of the target box, expressed as a fraction of the target
   * box dimensions (the worst of both axes). A value of `0.15` means "off by 15% of a target dimension".
   */
  centerError: number;
  /**
   * How far the vehicle box pokes outside of the target box, expressed as a fraction of the smallest target box
   * dimension. Negative values mean the vehicle box is strictly inside the target box, with margin.
   */
  overflow: number;
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
   * The target frame the vehicle box is compared against, in normalized frame coordinates.
   */
  targetBox: CenterBox;
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
