jest.mock(
  '../../../src/VideoCapture/hooks/useFastMovementsDetection/fastMovementsDetection',
  () => ({
    ...jest.requireActual(
      '../../../src/VideoCapture/hooks/useFastMovementsDetection/fastMovementsDetection',
    ),
    detectFastMovements: jest.fn(() => null),
  }),
);

import { act, renderHook } from '@testing-library/react';
import { DeviceRotation } from '@monkvision/types';
import {
  FastMovementType,
  useFastMovementsDetection,
  UseFastMovementsDetectionParams,
} from '../../../src/VideoCapture/hooks';
import { detectFastMovements } from '../../../src/VideoCapture/hooks/useFastMovementsDetection/fastMovementsDetection';
import {
  BLUR_CONSECUTIVE_FRAMES,
  BLUR_WARMUP_FRAMES,
} from '../../../src/VideoCapture/hooks/useFastMovementsDetection/blurDetection';

function createProps(): Required<UseFastMovementsDetectionParams> {
  return {
    isRecording: true,
    enableFastWalkingWarning: true,
    enablePhoneShakingWarning: true,
    fastWalkingWarningCooldown: 2000,
    phoneShakingWarningCooldown: 3000,
    enableBlurryFramesWarning: true,
    blurryFramesWarningCooldown: 4000,
  };
}

const SHARP_SCORE = 20;
const BLURRY_SCORE = 2;

function feedScores(onSelectedFrameScore: (score: number) => void, scores: number[]): void {
  scores.forEach((score) => {
    act(() => {
      onSelectedFrameScore(score);
    });
  });
}

const BLURRY_WALKAROUND = [
  ...new Array(BLUR_WARMUP_FRAMES).fill(SHARP_SCORE),
  ...new Array(BLUR_CONSECUTIVE_FRAMES).fill(BLURRY_SCORE),
];

function createRotation(): DeviceRotation {
  return {
    alpha: Math.random() * 360,
    beta: Math.random() * 360 - 180,
    gamma: Math.random() * 360 - 180,
  };
}

function detectNextMovement(type: FastMovementType | null): void {
  (detectFastMovements as jest.Mock).mockImplementationOnce(() => type);
}

jest.useFakeTimers();

describe('useFastMovementsDetection hook', () => {
  afterEach(() => {
    (detectFastMovements as jest.Mock).mockRestore();
    jest.clearAllMocks();
  });

  it('should return the proper initial state', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

    expect(result.current.onWarningDismiss).toEqual(expect.any(Function));
    expect(result.current.fastMovementsWarning).toBeNull();
    expect(result.current.onWarningDismiss).toEqual(expect.any(Function));

    unmount();
  });

  it('should call the detectFastMovements function with the proper params', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

    const rotation1 = createRotation();
    act(() => {
      result.current.onDeviceOrientationEvent(rotation1);
    });
    expect(detectFastMovements).not.toHaveBeenCalled();

    const rotation2 = createRotation();
    act(() => {
      result.current.onDeviceOrientationEvent(rotation2);
    });
    expect(detectFastMovements).toHaveBeenCalledWith(
      expect.objectContaining(rotation2),
      expect.objectContaining(rotation1),
      expect.arrayContaining([
        expect.objectContaining({ alpha: rotation1.alpha }),
        expect.objectContaining({ alpha: rotation2.alpha }),
      ]),
    );

    unmount();
  });

  it('should not display a warning if no warning was detected', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

    const rotation = createRotation();
    act(() => {
      result.current.onDeviceOrientationEvent(rotation);
    });
    expect(detectFastMovements).not.toHaveBeenCalled();
    expect(result.current.fastMovementsWarning).toBeNull();

    unmount();
  });

  it('should not display a warning if the video is not recording', () => {
    const initialProps = createProps();
    initialProps.isRecording = false;
    const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });

    detectNextMovement(FastMovementType.PHONE_SHAKING);
    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });
    expect(result.current.fastMovementsWarning).toBeNull();
    detectNextMovement(FastMovementType.WALKING_TOO_FAST);
    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });
    expect(result.current.fastMovementsWarning).toBeNull();

    unmount();
  });

  it('should not display the fast walking warning if it is disabled', () => {
    const initialProps = createProps();
    initialProps.enableFastWalkingWarning = false;
    const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });

    detectNextMovement(FastMovementType.WALKING_TOO_FAST);
    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });
    expect(result.current.fastMovementsWarning).toBeNull();

    unmount();
  });

  it('should not display the phone shaking warning if it is disabled', () => {
    const initialProps = createProps();
    initialProps.enablePhoneShakingWarning = false;
    const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });

    detectNextMovement(FastMovementType.PHONE_SHAKING);
    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });
    expect(result.current.fastMovementsWarning).toBeNull();

    unmount();
  });

  it('should display the detected warning and dismiss it properly', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });

    detectNextMovement(FastMovementType.WALKING_TOO_FAST);
    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });
    expect(result.current.fastMovementsWarning).toEqual(FastMovementType.WALKING_TOO_FAST);
    act(() => {
      result.current.onWarningDismiss();
    });
    expect(result.current.fastMovementsWarning).toBeNull();

    unmount();
  });

  it('should reset the rotation and alpha history baseline when resetDetection is called', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });
    act(() => {
      result.current.resetDetection();
    });

    const rotation = createRotation();
    act(() => {
      result.current.onDeviceOrientationEvent(rotation);
    });
    expect(detectFastMovements).not.toHaveBeenCalled();

    unmount();
  });

  it('should not display the same warning if it is on cooldown', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });

    detectNextMovement(FastMovementType.WALKING_TOO_FAST);
    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });
    act(() => {
      result.current.onWarningDismiss();
    });

    jest.advanceTimersByTime(initialProps.fastWalkingWarningCooldown - 1);
    detectNextMovement(FastMovementType.WALKING_TOO_FAST);
    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });
    expect(result.current.fastMovementsWarning).toBeNull();

    jest.advanceTimersByTime(2);
    detectNextMovement(FastMovementType.WALKING_TOO_FAST);
    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });
    expect(result.current.fastMovementsWarning).toEqual(FastMovementType.WALKING_TOO_FAST);
    act(() => {
      result.current.onWarningDismiss();
    });

    jest.advanceTimersByTime(5);
    detectNextMovement(FastMovementType.PHONE_SHAKING);
    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });
    expect(result.current.fastMovementsWarning).toEqual(FastMovementType.PHONE_SHAKING);
    act(() => {
      result.current.onWarningDismiss();
    });

    jest.advanceTimersByTime(initialProps.phoneShakingWarningCooldown - 1);
    detectNextMovement(FastMovementType.PHONE_SHAKING);
    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });
    expect(result.current.fastMovementsWarning).toBeNull();

    jest.advanceTimersByTime(2);
    detectNextMovement(FastMovementType.PHONE_SHAKING);
    act(() => {
      result.current.onDeviceOrientationEvent(createRotation());
    });
    expect(result.current.fastMovementsWarning).toEqual(FastMovementType.PHONE_SHAKING);

    unmount();
  });

  describe('blurry frames detection', () => {
    it('should display the blurry frames warning after consecutive blurry frames', () => {
      const initialProps = createProps();
      const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

      feedScores(result.current.onSelectedFrameScore, BLURRY_WALKAROUND.slice(0, -1));
      expect(result.current.fastMovementsWarning).toBeNull();
      feedScores(result.current.onSelectedFrameScore, BLURRY_WALKAROUND.slice(-1));
      expect(result.current.fastMovementsWarning).toEqual(FastMovementType.BLURRY_FRAMES);

      unmount();
    });

    it('should not display the blurry frames warning if the frames are sharp', () => {
      const initialProps = createProps();
      const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

      feedScores(result.current.onSelectedFrameScore, new Array(20).fill(SHARP_SCORE));
      expect(result.current.fastMovementsWarning).toBeNull();

      unmount();
    });

    it('should not display the blurry frames warning if the video is not recording', () => {
      const initialProps = createProps();
      initialProps.isRecording = false;
      const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

      feedScores(result.current.onSelectedFrameScore, BLURRY_WALKAROUND);
      expect(result.current.fastMovementsWarning).toBeNull();

      unmount();
    });

    it('should not display the blurry frames warning if it is disabled', () => {
      const initialProps = createProps();
      initialProps.enableBlurryFramesWarning = false;
      const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

      feedScores(result.current.onSelectedFrameScore, BLURRY_WALKAROUND);
      expect(result.current.fastMovementsWarning).toBeNull();

      unmount();
    });

    it('should be enabled by default', () => {
      const initialProps: UseFastMovementsDetectionParams = createProps();
      delete initialProps.enableBlurryFramesWarning;
      delete initialProps.blurryFramesWarningCooldown;
      const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

      feedScores(result.current.onSelectedFrameScore, BLURRY_WALKAROUND);
      expect(result.current.fastMovementsWarning).toEqual(FastMovementType.BLURRY_FRAMES);

      unmount();
    });

    it('should respect the blurry frames warning cooldown', () => {
      const initialProps = createProps();
      const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

      feedScores(result.current.onSelectedFrameScore, BLURRY_WALKAROUND);
      act(() => {
        result.current.onWarningDismiss();
      });

      jest.advanceTimersByTime(initialProps.blurryFramesWarningCooldown - 1);
      feedScores(
        result.current.onSelectedFrameScore,
        new Array(BLUR_CONSECUTIVE_FRAMES).fill(BLURRY_SCORE),
      );
      expect(result.current.fastMovementsWarning).toBeNull();

      jest.advanceTimersByTime(2);
      feedScores(result.current.onSelectedFrameScore, [BLURRY_SCORE]);
      expect(result.current.fastMovementsWarning).toEqual(FastMovementType.BLURRY_FRAMES);

      unmount();
    });

    it('should reset the blurry frames baseline when resetDetection is called', () => {
      const initialProps = createProps();
      const { result, unmount } = renderHook(useFastMovementsDetection, { initialProps });

      feedScores(
        result.current.onSelectedFrameScore,
        new Array(BLUR_WARMUP_FRAMES).fill(SHARP_SCORE),
      );
      act(() => {
        result.current.resetDetection();
      });
      feedScores(
        result.current.onSelectedFrameScore,
        new Array(BLUR_CONSECUTIVE_FRAMES).fill(BLURRY_SCORE),
      );
      expect(result.current.fastMovementsWarning).toBeNull();

      unmount();
    });
  });
});
