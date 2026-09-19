import { useRef } from 'react';
import { DEFAULT_INFERENCE_WIDTH } from '../constants';
import { useDebugToggle, useVehiclePositioning, useVideoContentRect } from '../hooks';
import { VehicleDetectionDebugPanel } from '../VehicleDetectionDebugPanel';
import { VehicleInstructionBanner } from '../VehicleInstructionBanner';
import { VehiclePositioningOverlay } from '../VehiclePositioningOverlay';
import { styles } from './VehicleDetectionOverlay.styles';
import { VehicleDetectionOverlayProps } from './VehicleDetectionOverlay.types';

/**
 * Real time vehicle framing guidance, drawn on top of a camera preview.
 *
 * It runs an EfficientDet-Lite0 object detector over the camera stream, smooths the detected vehicle box, and draws
 * corner brackets around the area the vehicle should fill plus the tracked vehicle box. Both turn amber while the
 * framing needs work and green once the vehicle is well framed, with a matching instruction and a haptic
 * confirmation.
 *
 * This is an *addition* on top of the Camera, not a HUD: it renders no camera preview and consumes no pointer events,
 * so it composes with whatever HUD the host already uses. Drop it anywhere inside a positioned ancestor that covers
 * the preview, and hand it the video element from the Camera handle:
 *
 * @example
 * <div style={{ position: 'relative' }}>
 *   {cameraPreview}
 *   <MyExistingHud />
 *   <VehicleDetectionOverlay videoRef={handle.videoRef} />
 * </div>
 *
 * Note: Render it *after* any interactive HUD layer. It is `pointer-events: none` throughout, so it never steals a
 * tap, but the hidden debug hotspot has to sit above the HUD to be reachable at all.
 *
 * Note: The `.tflite` model is not bundled with this package and has to be served by the host application. See the
 * README of this folder for how to set that up.
 */
export function VehicleDetectionOverlay({
  videoRef,
  debug = false,
  modelAssetPath,
  wasmBasePath,
  delegate,
  inferenceWidth = DEFAULT_INFERENCE_WIDTH,
  alphaPosition,
  alphaSize,
  onStateChange,
}: VehicleDetectionOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDebugEnabled, onHotspotClick } = useDebugToggle(debug);
  const contentRect = useVideoContentRect(videoRef, containerRef);
  const {
    state,
    detectorStatus,
    delegate: activeDelegate,
    smoothedBox,
    rawDetections,
    metrics,
    inferenceMs,
    candidateCount,
  } = useVehiclePositioning({
    videoRef,
    modelAssetPath,
    wasmBasePath,
    delegate,
    inferenceWidth,
    alphaPosition,
    alphaSize,
    keepRawDetections: isDebugEnabled,
    onStateChange,
  });

  return (
    <div style={styles['container']} ref={containerRef}>
      {contentRect && (
        <VehiclePositioningOverlay
          contentRect={contentRect}
          state={state}
          smoothedBox={smoothedBox}
          rawDetections={rawDetections}
          isDebugEnabled={isDebugEnabled}
        />
      )}
      <VehicleInstructionBanner state={state} detectorStatus={detectorStatus} />
      {isDebugEnabled && (
        <VehicleDetectionDebugPanel
          state={state}
          detectorStatus={detectorStatus}
          delegate={activeDelegate}
          metrics={metrics}
          inferenceMs={inferenceMs}
          candidateCount={candidateCount}
          contentRect={contentRect}
          inferenceWidth={inferenceWidth}
        />
      )}
      {/* Hidden developer gesture: three taps toggle the debug overlays. A button rather than a div so that it stays
          keyboard reachable and does not trip the accessibility lint rules. */}
      <button
        type='button'
        style={styles['debugHotspot']}
        onClick={onHotspotClick}
        aria-label='Toggle vehicle detection debug overlay'
        data-testid='vehicle-detection-debug-hotspot'
      />
    </div>
  );
}
