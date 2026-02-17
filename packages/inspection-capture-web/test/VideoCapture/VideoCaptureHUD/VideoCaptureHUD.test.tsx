jest.mock('../../../src/VideoCapture/VideoCaptureHUD/VideoCaptureTutorial', () => ({
  VideoCaptureTutorial: jest.fn(() => <></>),
}));
jest.mock('../../../src/VideoCapture/VideoCaptureHUD/VideoCaptureRecording', () => ({
  VideoCaptureRecording: jest.fn(() => <></>),
}));
jest.mock('../../../src/VideoCapture/VideoCaptureProcessing', () => ({
  VideoCaptureProcessing: jest.fn(() => <></>),
}));
jest.mock('../../../src/VideoCapture/hooks', () => ({
  ...jest.requireActual('../../../src/VideoCapture/hooks'),
  useVehicleWalkaround: jest.fn(() => ({ walkaroundPosition: 334, startWalkaround: jest.fn() })),
  useVideoUploadQueue: jest.fn(() => ({
    uploadedFrames: 154,
    totalUploadingFrames: 987,
    onFrameSelected: jest.fn(),
  })),
  useFrameSelection: jest.fn(() => ({
    processedFrames: 986,
    totalProcessingFrames: 6782,
    onCaptureVideoFrame: jest.fn(),
  })),
  useVideoRecording: jest.fn(() => ({
    isRecordingPaused: true,
    onClickRecordVideo: jest.fn(),
    onDiscardDialogKeepRecording: jest.fn(),
    onDiscardDialogDiscardVideo: jest.fn(),
    isDiscardDialogDisplayed: false,
    recordingDurationMs: 234,
    pauseRecording: jest.fn(),
    resumeRecording: jest.fn(),
    tooltip: null,
  })),
}));

import { act, render, screen } from '@testing-library/react';
import { CameraHandle } from '@monkvision/camera-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { DeviceOrientation } from '@monkvision/types';
import { LoadingState } from '@monkvision/common';
import { ImageUploadType, useMonkApi } from '@monkvision/network';
import { BackdropDialog } from '@monkvision/common-ui-web';
import { VideoCaptureHUD, VideoCaptureHUDProps } from '../../../src/VideoCapture/VideoCaptureHUD';
import { VideoCaptureRecording } from '../../../src/VideoCapture/VideoCaptureHUD/VideoCaptureRecording';
import { VideoCaptureTutorial } from '../../../src/VideoCapture/VideoCaptureHUD/VideoCaptureTutorial';
import { VideoCaptureProcessing } from '../../../src/VideoCapture/VideoCaptureProcessing';
import {
  FastMovementType,
  useFrameSelection,
  useVehicleWalkaround,
  useVideoRecording,
  useVideoUploadQueue,
  VideoRecordingTooltip,
} from '../../../src/VideoCapture/hooks';

const CAMERA_TEST_ID = 'test-id';

function createProps(): VideoCaptureHUDProps {
  return {
    handle: {
      takePicture: jest.fn(),
    } as unknown as CameraHandle,
    cameraPreview: <div data-testid={CAMERA_TEST_ID}></div>,
    inspectionId: 'test-inspection-id',
    apiConfig: {
      apiDomain: 'test-api-domain',
      authToken: 'test-auth-token',
      thumbnailDomain: 'test-thumbnail-domain',
    },
    isRecording: true,
    setIsRecording: jest.fn(),
    enforceOrientation: DeviceOrientation.LANDSCAPE,
    alpha: 12,
    fastMovementsWarning: null,
    onWarningDismiss: jest.fn(),
    maxRetryCount: 24,
    minRecordingDuration: 667,
    startTasksLoading: { isLoading: false } as unknown as LoadingState,
    onComplete: jest.fn(),
  };
}

describe('VideoCaptureHUD component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show the camera preview on the screen', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    expect(screen.queryByTestId(CAMERA_TEST_ID)).not.toBeNull();

    unmount();
  });

  it('should pass the proper params to the useVehicleWalkaround hook', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    expect(useVehicleWalkaround).toHaveBeenCalledWith(
      expect.objectContaining({ alpha: props.alpha }),
    );

    unmount();
  });

  it('should pass the apiConfig to the useMonkApi hook', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    expect(useMonkApi).toHaveBeenCalledWith(props.apiConfig);

    unmount();
  });

  it('should pass the proper props to the useVideoUploadQueue hook', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    expect(useVideoUploadQueue).toHaveBeenCalledWith(
      expect.objectContaining({
        apiConfig: props.apiConfig,
        inspectionId: props.inspectionId,
        maxRetryCount: props.maxRetryCount,
      }),
    );

    unmount();
  });

  it('should pass the proper props to the useFrameSelection hook', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    const { onFrameSelected } = (useVideoUploadQueue as jest.Mock).mock.results[0].value;
    expect(useFrameSelection).toHaveBeenCalledWith(
      expect.objectContaining({
        handle: props.handle,
        frameSelectionInterval: 1000,
        onFrameSelected,
      }),
    );

    unmount();
  });

  it('should pass the proper props to the useVideoRecording hook', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    const { onCaptureVideoFrame } = (useFrameSelection as jest.Mock).mock.results[0].value;
    const { walkaroundPosition, startWalkaround } = (useVehicleWalkaround as jest.Mock).mock
      .results[0].value;
    expect(useVideoRecording).toHaveBeenCalledWith(
      expect.objectContaining({
        isRecording: props.isRecording,
        setIsRecording: props.setIsRecording,
        screenshotInterval: 200,
        minRecordingDuration: props.minRecordingDuration,
        enforceOrientation: props.enforceOrientation,
        walkaroundPosition,
        startWalkaround,
        onCaptureVideoFrame,
        onRecordingComplete: expect.any(Function),
      }),
    );

    unmount();
  });

  it('should show the VideoCapture tutorial at the start', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    expect(VideoCaptureTutorial).toHaveBeenCalled();
    expect(VideoCaptureRecording).not.toHaveBeenCalled();
    expect(VideoCaptureProcessing).not.toHaveBeenCalled();
    expect(BackdropDialog).not.toHaveBeenCalledWith(
      expect.objectContaining({ show: true }),
      expect.anything(),
    );

    unmount();
  });

  it('should skip to the VideoRecording when closing the tutorial', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    expectPropsOnChildMock(VideoCaptureTutorial, { onClose: expect.any(Function) });
    const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
    expect(VideoCaptureRecording).not.toHaveBeenCalled();
    act(() => {
      onClose();
    });
    expect(VideoCaptureRecording).toHaveBeenCalled();
    expect(VideoCaptureProcessing).not.toHaveBeenCalled();
    expect(BackdropDialog).not.toHaveBeenCalledWith(
      expect.objectContaining({ show: true }),
      expect.anything(),
    );

    unmount();
  });

  it('should pass the proper props to the VideoCaptureRecording component', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
    act(() => {
      onClose();
    });
    const { walkaroundPosition } = (useVehicleWalkaround as jest.Mock).mock.results[0].value;
    const useVideoRecordingResults = (useVideoRecording as jest.Mock).mock.results;
    const { isRecordingPaused, recordingDurationMs, onClickRecordVideo } =
      useVideoRecordingResults[useVideoRecordingResults.length - 1].value;
    expectPropsOnChildMock(VideoCaptureRecording, {
      walkaroundPosition,
      isRecording: props.isRecording,
      isRecordingPaused,
      recordingDurationMs,
      onClickRecordVideo,
      tooltip: undefined,
    });

    unmount();
  });

  it('should pass the proper tooltip label for the Start tooltip', () => {
    const mockResult = (useVideoRecording as jest.Mock)();
    (useVideoRecording as jest.Mock).mockImplementation(() => ({
      ...mockResult,
      tooltip: VideoRecordingTooltip.START,
    }));

    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
    act(() => {
      onClose();
    });
    expectPropsOnChildMock(VideoCaptureRecording, {
      tooltip: 'video.recording.tooltip.start',
    });

    unmount();
  });

  it('should pass the proper tooltip label for the End tooltip', () => {
    const mockResult = (useVideoRecording as jest.Mock)();
    (useVideoRecording as jest.Mock).mockImplementation(() => ({
      ...mockResult,
      tooltip: VideoRecordingTooltip.END,
    }));

    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
    act(() => {
      onClose();
    });
    expectPropsOnChildMock(VideoCaptureRecording, {
      tooltip: 'video.recording.tooltip.end',
    });

    unmount();
  });

  it('should take a picture and upload it when pressing on the take picture button', async () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    const { onClose } = (VideoCaptureTutorial as jest.Mock).mock.calls[0][0];
    act(() => {
      onClose();
    });
    const picture = { test: 'picture' };
    (props.handle.takePicture as jest.Mock).mockImplementationOnce(() => Promise.resolve(picture));
    const { addImage } = (useMonkApi as jest.Mock).mock.results[0].value;
    expectPropsOnChildMock(VideoCaptureRecording, { onClickTakePicture: expect.any(Function) });
    const { onClickTakePicture } = (VideoCaptureRecording as jest.Mock).mock.calls[0][0];

    expect(props.handle.takePicture).not.toHaveBeenCalled();
    expect(addImage).not.toHaveBeenCalled();
    await act(async () => {
      await onClickTakePicture();
    });
    expect(props.handle.takePicture).toHaveBeenCalled();
    expect(addImage).toHaveBeenCalledWith(
      expect.objectContaining({
        uploadType: ImageUploadType.VIDEO_MANUAL_PHOTO,
        inspectionId: props.inspectionId,
        picture,
      }),
    );

    unmount();
  });

  it('should move on to the VideoCaptureProcessing on recording complete', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    const { onRecordingComplete } = (useVideoRecording as jest.Mock).mock.calls[0][0];
    expect(VideoCaptureProcessing).not.toHaveBeenCalled();
    act(() => {
      onRecordingComplete();
    });
    expect(VideoCaptureProcessing).toHaveBeenCalled();
    expect(BackdropDialog).not.toHaveBeenCalledWith(
      expect.objectContaining({ show: true }),
      expect.anything(),
    );

    unmount();
  });

  it('should pass the proper props to the VideoCaptureProcessing component', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureHUD {...props} />);

    const { onRecordingComplete } = (useVideoRecording as jest.Mock).mock.calls[0][0];
    expect(VideoCaptureProcessing).not.toHaveBeenCalled();
    act(() => {
      onRecordingComplete();
    });
    const { processedFrames, totalProcessingFrames } = (useFrameSelection as jest.Mock).mock
      .results[0].value;
    const { uploadedFrames, totalUploadingFrames } = (useVideoUploadQueue as jest.Mock).mock
      .results[0].value;
    expectPropsOnChildMock(VideoCaptureProcessing, {
      inspectionId: props.inspectionId,
      processedFrames,
      totalProcessingFrames,
      uploadedFrames,
      totalUploadingFrames,
      loading: props.startTasksLoading,
      onComplete: props.onComplete,
    });

    unmount();
  });

  it('should display a backdrop dialog when the user quits the video early', () => {
    const props = createProps();
    const { rerender, unmount } = render(<VideoCaptureHUD {...props} />);

    const onDiscardDialogKeepRecording = jest.fn();
    const onDiscardDialogDiscardVideo = jest.fn();
    (useVideoRecording as jest.Mock).mockImplementationOnce(() => ({
      isRecordingPaused: true,
      onClickRecordVideo: jest.fn(),
      onDiscardDialogKeepRecording,
      onDiscardDialogDiscardVideo,
      isDiscardDialogDisplayed: true,
      recordingDurationMs: 234,
      pauseRecording: jest.fn(),
      resumeRecording: jest.fn(),
    }));
    expect(BackdropDialog).not.toHaveBeenCalledWith(
      expect.objectContaining({ show: true }),
      expect.anything(),
    );
    rerender(<VideoCaptureHUD {...props} />);
    expectPropsOnChildMock(BackdropDialog, {
      show: true,
      message: 'video.recording.discardDialog.message',
      confirmLabel: 'video.recording.discardDialog.keepRecording',
      cancelLabel: 'video.recording.discardDialog.discardVideo',
      onConfirm: onDiscardDialogKeepRecording,
      onCancel: onDiscardDialogDiscardVideo,
    });

    unmount();
  });

  it('should display a backdrop dialog when the user moves too fast', () => {
    const props = createProps();
    const { rerender, unmount } = render(<VideoCaptureHUD {...props} />);

    expect(BackdropDialog).not.toHaveBeenCalledWith(
      expect.objectContaining({ show: true }),
      expect.anything(),
    );
    props.fastMovementsWarning = FastMovementType.WALKING_TOO_FAST;
    rerender(<VideoCaptureHUD {...props} />);
    expectPropsOnChildMock(BackdropDialog, {
      show: true,
      message: 'video.recording.fastMovementsDialog.walkingTooFast',
      confirmLabel: 'video.recording.fastMovementsDialog.confirm',
      onConfirm: props.onWarningDismiss,
      showCancelButton: false,
      dialogIcon: 'warning-outline',
      dialogIconPrimaryColor: 'caution',
    });
    props.fastMovementsWarning = FastMovementType.PHONE_SHAKING;
    (BackdropDialog as jest.Mock).mockClear();
    rerender(<VideoCaptureHUD {...props} />);
    expectPropsOnChildMock(BackdropDialog, {
      show: true,
      message: 'video.recording.fastMovementsDialog.phoneShaking',
      confirmLabel: 'video.recording.fastMovementsDialog.confirm',
      onConfirm: props.onWarningDismiss,
      showCancelButton: false,
      dialogIcon: 'warning-outline',
      dialogIconPrimaryColor: 'caution',
    });

    unmount();
  });
});
