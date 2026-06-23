import { CameraConfig } from '../../Camera.types';

export function getMediaConstraints(config: CameraConfig): MediaStreamConstraints {
  const { resolution, facingMode } = config;
  const width = resolution?.width ?? 1920;
  const height = resolution?.height ?? 1080;

  return {
    audio: false,
    video: {
      width: { ideal: width },
      height: { ideal: height },
      facingMode: { ideal: facingMode },
    },
  };
}

/**
 * Attempt to apply continuous autofocus on a video track.
 * Silently ignored on unsupported browsers (e.g. iOS Safari < 17).
 */
export async function applyFocusConstraints(track: MediaStreamTrack): Promise<void> {
  try {
    await track.applyConstraints({
      // @ts-expect-error — focusMode is not yet in lib.dom.d.ts but is supported on modern browsers
      focusMode: 'continuous',
    });
  } catch (_) {
    // Device does not support focus constraints — fail silently
  }
}
