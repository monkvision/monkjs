import { CameraConfig } from '../../Camera.types';

export function getMediaConstraints(config: CameraConfig): MediaStreamConstraints {
  const { resolution, facingMode } = config;
  const { width, height } = resolution;
  return {
    audio: false,
    video: {
      width: { ideal: width },
      height: { ideal: height },
      facingMode,
    },
  };
}

/**
 * Attempts to apply continuous autofocus constraints to the first video track of a stream.
 * Silently ignored on browsers/devices that do not support the focusMode constraint (e.g. iOS < 17).
 */
export async function applyFocusConstraints(stream: MediaStream): Promise<void> {
  try {
    const [track] = stream.getVideoTracks();
    if (!track) return;
    // MediaTrackConstraints focusMode is not yet in all TS lib typings — cast to any
    await (track as any).applyConstraints({
      advanced: [{ focusMode: 'continuous' } as any],
    });
  } catch {
    // Silently ignore — device does not support focus constraints
  }
}
