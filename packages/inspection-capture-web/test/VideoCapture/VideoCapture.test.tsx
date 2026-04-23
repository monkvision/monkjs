const { FastMovementType } = jest.requireActual('../../src/VideoCapture/hooks');

jest.mock('../../src/VideoCapture/hooks', () => ({
  FastMovementType,
  useFastMovementsDetection: jest.fn(() => ({
    onDeviceOrientationEvent: jest.fn(),
    fastMovementsWarning: FastMovementType.PHONE_SHAKING,
    onWarningDismiss: jest.fn(),
  })),
  useGetInspection: jest.fn(),
  useHybridVideoState: jest.fn(() => ({
    enableHybridVideo: false,
    photoCaptureConfig: null,
  })),
}));
jest.mock('../../src/hooks', () => ({
  useStartTasksOnComplete: jest.fn(() => jest.fn(() => Promise.resolve())),
}));
jest.mock('../../src/VideoCapture/VideoCapturePermissions', () => ({
  VideoCapturePermissions: jest.fn(() => <></>),
}));
jest.mock('../../src/VideoCapture/VideoCaptureHUD', () => ({
  VideoCaptureHUD: jest.fn(() => <></>),
}));
jest.mock('../../src/VideoCapture/VideoCaptureTutorial', () => ({
  VideoCaptureTutorial: jest.fn(() => <></>),
}));
jest.mock('@monkvision/common-ui-web', () => ({
  ...jest.requireActual('@monkvision/common-ui-web'),
  VehicleTypeSelection: jest.fn(() => <></>),
}));
jest.mock('../../src/PhotoCapture/PhotoCapture', () => ({
  PhotoCapture: jest.fn(() => <></>),
}));

import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { useDeviceOrientation } from '@monkvision/common';
import { DeviceOrientation, TaskName, VehicleType } from '@monkvision/types';
import { act, render } from '@testing-library/react';
import { Camera } from '@monkvision/camera-web';
import { VideoCapture, VideoCaptureProps } from '../../src';
import { useFastMovementsDetection, useHybridVideoState } from '../../src/VideoCapture/hooks';
import { useStartTasksOnComplete } from '../../src/hooks';
import { VideoCapturePermissions } from '../../src/VideoCapture/VideoCapturePermissions';
import { VideoCaptureHUD } from '../../src/VideoCapture/VideoCaptureHUD';
import { VideoCaptureTutorial } from '../../src/VideoCapture/VideoCaptureTutorial';
import { PhotoCapture } from '../../src/PhotoCapture/PhotoCapture';
import type { HybridVideoProps } from '../../src/VideoCapture/VideoCapture';

function createProps(): VideoCaptureProps {
  return {
    inspectionId: 'test-inspection-id',
    apiConfig: {
      apiDomain: 'test-api-domain',
      authToken: 'test-auth-token',
      thumbnailDomain: 'test-thumbnail-domain',
    },
    additionalTasks: [TaskName.INSPECTION_PDF],
    startTasksOnComplete: [TaskName.HUMAN_IN_THE_LOOP],
    enforceOrientation: DeviceOrientation.LANDSCAPE,
    minRecordingDuration: 1234,
    maxRetryCount: 13,
    enableFastWalkingWarning: true,
    enablePhoneShakingWarning: false,
    fastWalkingWarningCooldown: 4321,
    phoneShakingWarningCooldown: 6543,
    onComplete: jest.fn(),
    lang: 'us',
  };
}

function createHybridProps(): HybridVideoProps {
  return {
    ...createProps(),
    enableHybridVideo: true,
    defaultVehicleType: VehicleType.SEDAN,
    allowVehicleTypeSelection: false,
    enableSteeringWheelPosition: false,
    sights: {
      [VehicleType.SEDAN]: ['test-sight-1', 'test-sight-2'],
    },
    tasksBySight: {},
  };
}

describe('VideoCapture component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass the proper params to the useFastMovementsDetection hook', () => {
    const props = createProps();
    const { unmount } = render(<VideoCapture {...props} />);

    expect(useFastMovementsDetection).toHaveBeenCalledWith(
      expect.objectContaining({
        isRecording: false,
        enableFastWalkingWarning: props.enableFastWalkingWarning,
        enablePhoneShakingWarning: props.enablePhoneShakingWarning,
        fastWalkingWarningCooldown: props.fastWalkingWarningCooldown,
        phoneShakingWarningCooldown: props.phoneShakingWarningCooldown,
      }),
    );

    unmount();
  });

  it('should pass the proper params to the useDeviceOrientation hook', () => {
    const props = createProps();
    const { unmount } = render(<VideoCapture {...props} />);

    const { onDeviceOrientationEvent } = (useFastMovementsDetection as jest.Mock).mock.results[0]
      .value;
    expect(useDeviceOrientation).toHaveBeenCalledWith(
      expect.objectContaining({
        onDeviceOrientationEvent,
      }),
    );

    unmount();
  });

  it('should pass the proper params to the useStartTasksOnComplete hook', () => {
    const props = createProps();
    const { unmount } = render(<VideoCapture {...props} />);

    expect(useStartTasksOnComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        inspectionId: props.inspectionId,
        apiConfig: props.apiConfig,
        additionalTasks: props.additionalTasks,
        startTasksOnComplete: props.startTasksOnComplete,
        loading: expect.anything(),
      }),
    );

    unmount();
  });

  it('should start by displaying the camera permissions', () => {
    const props = createProps();
    const { unmount } = render(<VideoCapture {...props} />);

    expect(VideoCapturePermissions).toHaveBeenCalled();
    expect(Camera).not.toHaveBeenCalled();

    unmount();
  });

  it('should pass the proper props to the VideoCapturePermissions component', () => {
    const props = createProps();
    const { unmount } = render(<VideoCapture {...props} />);

    const { requestCompassPermission } = (useDeviceOrientation as jest.Mock).mock.results[0].value;
    expectPropsOnChildMock(VideoCapturePermissions, {
      requestCompassPermission,
    });

    unmount();
  });

  it('should switch over to the camera once the permissions are granted', () => {
    const props = createProps();
    const { unmount } = render(<VideoCapture {...props} />);

    expectPropsOnChildMock(VideoCapturePermissions, {
      onSuccess: expect.any(Function),
    });
    const { onSuccess } = (VideoCapturePermissions as jest.Mock).mock.calls[0][0];
    expect(Camera).not.toHaveBeenCalled();
    act(() => {
      onSuccess();
    });

    expect(VideoCaptureTutorial).toHaveBeenCalled();
    const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
    act(() => {
      onClose();
    });

    expect(Camera).toHaveBeenCalled();

    unmount();
  });

  it('should use the VideoCaptureHUD component as the Camera HUD', () => {
    const props = createProps();
    const { unmount } = render(<VideoCapture {...props} />);

    const { onSuccess } = (VideoCapturePermissions as jest.Mock).mock.calls[0][0];
    act(() => {
      onSuccess();
    });

    const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
    act(() => {
      onClose();
    });

    expectPropsOnChildMock(Camera, {
      HUDComponent: VideoCaptureHUD,
    });

    unmount();
  });

  it('should pass the proper props to the VideoCaptureHUD component', () => {
    const props = createProps();
    const { unmount } = render(<VideoCapture {...props} />);

    const { onSuccess } = (VideoCapturePermissions as jest.Mock).mock.calls[0][0];
    act(() => {
      onSuccess();
    });

    const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
    act(() => {
      onClose();
    });

    const useDeviceOrientationResults = (useDeviceOrientation as jest.Mock).mock.results;
    const { alpha } = useDeviceOrientationResults[useDeviceOrientationResults.length - 1].value;

    const useFastMovementsDetectionResults = (useFastMovementsDetection as jest.Mock).mock.results;
    const { fastMovementsWarning, onWarningDismiss } =
      useFastMovementsDetectionResults[useFastMovementsDetectionResults.length - 1].value;

    expectPropsOnChildMock(Camera, {
      hudProps: expect.objectContaining({
        inspectionId: props.inspectionId,
        maxRetryCount: props.maxRetryCount,
        apiConfig: props.apiConfig,
        minRecordingDuration: props.minRecordingDuration,
        enforceOrientation: props.enforceOrientation,
        isRecording: expect.any(Boolean),
        setIsRecording: expect.any(Function),
        alpha,
        fastMovementsWarning,
        onWarningDismiss,
        startTasksLoading: expect.anything(),
        enableHybridVideo: false,
        onComplete: expect.any(Function),
      }),
    });

    unmount();
  });

  it('should transition to PHOTO_CAPTURE screen on capture complete', () => {
    const props = createProps();
    const { unmount } = render(<VideoCapture {...props} />);

    const { onSuccess } = (VideoCapturePermissions as jest.Mock).mock.calls[0][0];
    act(() => {
      onSuccess();
    });

    const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
    act(() => {
      onClose();
    });

    expectPropsOnChildMock(Camera, {
      hudProps: expect.objectContaining({
        onComplete: expect.any(Function),
      }),
    });
    const { onComplete } = (Camera as jest.Mock).mock.calls[0][0].hudProps;

    act(() => {
      onComplete();
    });

    expect(PhotoCapture).not.toHaveBeenCalled();

    unmount();
  });

  describe('hybrid mode with photo capture', () => {
    it('should not render PhotoCapture when enableHybridVideo is false', () => {
      const props = createProps();
      const { unmount } = render(<VideoCapture {...props} />);

      const { onSuccess } = (VideoCapturePermissions as jest.Mock).mock.calls[0][0];
      act(() => {
        onSuccess();
      });

      const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
      act(() => {
        onClose();
      });

      expect(PhotoCapture).not.toHaveBeenCalled();

      unmount();
    });

    it('should render PhotoCapture when enableHybridVideo is true and video capture is complete', () => {
      const props = createHybridProps();
      const mockPhotoCaptureConfig = {
        inspectionId: props.inspectionId,
        apiConfig: props.apiConfig,
        sights: [],
      };
      (useHybridVideoState as jest.Mock).mockReturnValue({
        enableHybridVideo: true,
        photoCaptureConfig: mockPhotoCaptureConfig,
      });

      const { unmount } = render(<VideoCapture {...props} />);

      const { onSuccess } = (VideoCapturePermissions as jest.Mock).mock.calls[0][0];
      act(() => {
        onSuccess();
      });

      const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
      act(() => {
        onClose();
      });

      expect(PhotoCapture).not.toHaveBeenCalled();

      const { onComplete } = (Camera as jest.Mock).mock.calls[0][0].hudProps;
      act(() => {
        onComplete();
      });

      expect(PhotoCapture).toHaveBeenCalled();

      unmount();
    });

    it('should pass the photo capture config to PhotoCapture component', () => {
      const props = createHybridProps();
      const mockPhotoCaptureConfig = {
        inspectionId: props.inspectionId,
        apiConfig: props.apiConfig,
        sights: [],
        vehicleType: props.defaultVehicleType,
        tasksBySight: props.tasksBySight,
      };
      (useHybridVideoState as jest.Mock).mockReturnValue({
        enableHybridVideo: true,
        photoCaptureConfig: mockPhotoCaptureConfig,
      });

      const { unmount } = render(<VideoCapture {...props} />);

      const { onSuccess } = (VideoCapturePermissions as jest.Mock).mock.calls[0][0];
      act(() => {
        onSuccess();
      });

      const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
      act(() => {
        onClose();
      });

      const { onComplete: onVideoCaptureComplete } = (Camera as jest.Mock).mock.calls[0][0]
        .hudProps;
      act(() => {
        onVideoCaptureComplete();
      });

      expectPropsOnChildMock(PhotoCapture, {
        inspectionId: props.inspectionId,
        apiConfig: props.apiConfig,
        vehicleType: props.defaultVehicleType,
        sights: expect.any(Array),
        tasksBySight: props.tasksBySight,
      });

      unmount();
    });

    it('should not render PhotoCapture before video capture is complete', () => {
      const props = createHybridProps();
      (useHybridVideoState as jest.Mock).mockReturnValue({
        enableHybridVideo: true,
        photoCaptureConfig: {
          inspectionId: props.inspectionId,
          apiConfig: props.apiConfig,
          sights: [],
        },
      });

      const { unmount } = render(<VideoCapture {...props} />);

      const { onSuccess } = (VideoCapturePermissions as jest.Mock).mock.calls[0][0];
      act(() => {
        onSuccess();
      });

      const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
      act(() => {
        onClose();
      });

      expect(PhotoCapture).not.toHaveBeenCalled();

      unmount();
    });
  });
});
