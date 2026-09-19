import { RefObject } from 'react';
import { DetectorDelegate, VehiclePositioningState } from '../types';

/**
 * Props accepted by the VehicleDetectionOverlay component.
 */
export interface VehicleDetectionOverlayProps {
  /**
   * Ref to the video element displaying the camera preview. Available on the Camera handle as `handle.videoRef`.
   */
  videoRef: RefObject<HTMLVideoElement | null>;
  /**
   * Whether debug mode starts enabled. It can also be toggled at runtime by tapping the hidden hotspot in the top
   * right corner of the screen three times in quick succession.
   *
   * @default false
   */
  debug?: boolean;
  /**
   * The URL of the `.tflite` model to load. The model is not shipped inside the package, it has to be served by the
   * host application.
   *
   * @default DEFAULT_MODEL_ASSET_PATH
   */
  modelAssetPath?: string;
  /**
   * The base URL of the MediaPipe vision WASM runtime.
   *
   * @default DEFAULT_WASM_BASE_PATH
   */
  wasmBasePath?: string;
  /**
   * Which backend the model should run on.
   *
   * @default DetectorDelegate.AUTO
   */
  delegate?: DetectorDelegate;
  /**
   * The width the camera frames are downscaled to before inference, or null to run inference on the full resolution
   * frames.
   *
   * @default DEFAULT_INFERENCE_WIDTH
   */
  inferenceWidth?: number | null;
  /**
   * The smoothing factor applied to the center of the vehicle box.
   *
   * @default EMA_ALPHA_POSITION
   */
  alphaPosition?: number;
  /**
   * The smoothing factor applied to the size of the vehicle box.
   *
   * @default EMA_ALPHA_SIZE
   */
  alphaSize?: number;
  /**
   * Called whenever the positioning state changes.
   */
  onStateChange?: (state: VehiclePositioningState) => void;
}
