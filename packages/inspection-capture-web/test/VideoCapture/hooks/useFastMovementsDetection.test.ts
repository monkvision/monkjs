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

function createProps(): UseFastMovementsDetectionParams {
  return {
    isRecording: true,
    enableFastWalkingWarning: true,
    enablePhoneShakingWarning: true,
    fastWalkingWarningCooldown: 2000,
    phoneShakingWarningCooldown: 3000,
  };
}

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
});
