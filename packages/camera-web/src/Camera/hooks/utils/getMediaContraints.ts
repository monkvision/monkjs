import { CameraFacingMode, CameraResolution } from '../../../Camera.types';

export interface MediaConstraintsConfig {
  resolution: CameraResolution;
  facingMode: CameraFacingMode;
}

function getResolutionConstraints(resolution: CameraResolution): Pick<MediaTrackConstraints, 'width' | 'height'> {
  switch (resolution) {
    case CameraResolution.NHD_360P:
      return { width: { ideal: 640 }, height: { ideal: 360 } };
    case CameraResolution.HD_720P:
      return { width: { ideal: 1280 }, height: { ideal: 720 } };
    case CameraResolution.FHD_1080P:
      return { width: { ideal: 1920 }, height: { ideal: 1080 } };
    case CameraResolution.QHD_2K:
      return { width: { ideal: 2560 }, height: { ideal: 1440 } };
    case CameraResolution.UHD_4K:
      return { width: { ideal: 3840 }, height: { ideal: 2160 } };
    default:
      return { width: { ideal: 1920 }, height: { ideal: 1080 } };
  }
}

export function getMediaConstraints(config: MediaConstraintsConfig): MediaStreamConstraints {
  const { width, height } = getResolutionConstraints(config.resolution);
  return {
    audio: false,
    video: {
      width,
      height,
      facingMode: config.facingMode,
    },
  };
}

/**
 * Applies focus constraints to an active video track after the stream is obtained.
 * Uses focusMode 'continuous' to keep the camera actively focusing — critical for
 * close-up shots like penny-tests. Falls back silently on unsupported devices (iOS < 17).
 */
export async function applyFocusConstraints(track: MediaStreamTrack): Promise<void> {
  try {
    const capabilities = track.getCapabilities() as MediaTrackCapabilities & {
      focusMode?: string[];
    };
    // Only apply if the device supports focusMode (Android Chrome, iOS 17+)
    if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
      await track.applyConstraints({
        // @ts-expect-error focusMode is not in the TS lib yet but is a valid W3C constraint
        focusMode: 'continuous',
      } as MediaTrackConstraints);
    }
  } catch {
    // Silently ignore — unsupported browsers will continue with default focus behaviour
  }
}
