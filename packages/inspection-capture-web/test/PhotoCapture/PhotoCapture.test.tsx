import { sights } from '@monkvision/sights';

const { PhotoCaptureMode } = jest.requireActual('../../src/PhotoCapture/hooks');

jest.mock('../../src/PhotoCapture/hooks', () => ({
  useAddDamageMode: jest.fn(() => ({
    mode: PhotoCaptureMode.SIGHT,
    handleAddDamage: jest.fn(),
    updatePhotoCaptureModeAfterPictureTaken: jest.fn(),
    handleCancelAddDamage: jest.fn(),
  })),
  usePhotoCaptureSightState: jest.fn(() => ({
    selectedSight: sights['test-sight-2'],
    sightsTaken: [sights['test-sight-1']],
    selectSight: jest.fn(),
    takeSelectedSight: jest.fn(),
    lastPictureTaken: {
      uri: 'test-uri-test',
      mimetype: 'test-mimetype-test',
      width: 1234,
      height: 4567,
    },
    setLastPictureTaken: jest.fn(),
    retryLoadingInspection: jest.fn(),
  })),
  usePictureTaken: jest.fn(() => jest.fn()),
  useUploadQueue: jest.fn(() => ({
    length: 3,
  })),
  useStartTasksOnComplete: jest.fn(() => jest.fn()),
}));

import { act, render, waitFor } from '@testing-library/react';
import { Camera, CameraResolution, CompressionFormat } from '@monkvision/camera-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { PhotoCapture, PhotoCaptureHUD, PhotoCaptureProps } from '../../src';
import {
  useAddDamageMode,
  usePhotoCaptureSightState,
  usePictureTaken,
  useStartTasksOnComplete,
  useUploadQueue,
} from '../../src/PhotoCapture/hooks';
import { useI18nSync, useLoadingState } from '@monkvision/common';
import { ComplianceIssue, TaskName } from '@monkvision/types';
import { InspectionGallery } from '@monkvision/common-ui-web';
import { useMonitoring } from '@monkvision/monitoring';

function createProps(): PhotoCaptureProps {
  return {
    sights: [sights['test-sight-1'], sights['test-sight-2'], sights['test-sight-3']],
    inspectionId: 'test-inspection-test',
    apiConfig: { apiDomain: 'test-api-domain-test', authToken: 'test-auth-token-test' },
    enableCompliance: true,
    complianceIssues: [ComplianceIssue.INTERIOR_NOT_SUPPORTED],
    onClose: jest.fn(),
    onComplete: jest.fn(),
    resolution: CameraResolution.NHD_360P,
    format: CompressionFormat.JPEG,
    quality: 0.4,
    showCloseButton: true,
    lang: 'de',
    allowSkipRetake: true,
  };
}

describe('PhotoCapture component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass the proper params to the useStartTasksOnComplete hook', () => {
    const props = {
      ...createProps(),
      startTasksOnComplete: true,
      tasksBySight: { test: [TaskName.DAMAGE_DETECTION] },
    };
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useLoadingState).toHaveBeenCalled();
    const loading = (useLoadingState as jest.Mock).mock.results[0].value;
    expect(useStartTasksOnComplete).toHaveBeenCalledWith({
      inspectionId: props.inspectionId,
      apiConfig: props.apiConfig,
      sights: props.sights,
      tasksBySight: props.tasksBySight,
      startTasksOnComplete: props.startTasksOnComplete,
      loading,
    });

    unmount();
  });

  it('should pass the proper params to the usePhotoCaptureSightState hooks', () => {
    const props = { ...createProps(), tasksBySight: { test: [TaskName.DAMAGE_DETECTION] } };
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useLoadingState).toHaveBeenCalled();
    const loading = (useLoadingState as jest.Mock).mock.results[0].value;
    expect(usePhotoCaptureSightState).toHaveBeenCalledWith({
      inspectionId: props.inspectionId,
      captureSights: props.sights,
      apiConfig: props.apiConfig,
      loading,
      onLastSightTaken: expect.any(Function),
      tasksBySight: props.tasksBySight,
      enableCompliance: props.enableCompliance,
      complianceIssues: props.complianceIssues,
    });

    unmount();
  });

  it('should pass the proper params to the usePhotoCaptureSightState hook', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useLoadingState).toHaveBeenCalled();
    const loading = (useLoadingState as jest.Mock).mock.results[0].value;
    expect(usePhotoCaptureSightState).toHaveBeenCalled();
    const { onLastSightTaken } = (usePhotoCaptureSightState as jest.Mock).mock.calls[0][0];
    expect(usePhotoCaptureSightState).toHaveBeenCalledWith({
      inspectionId: props.inspectionId,
      captureSights: props.sights,
      apiConfig: props.apiConfig,
      loading,
      onLastSightTaken,
      enableCompliance: props.enableCompliance,
      complianceIssues: props.complianceIssues,
    });

    unmount();
  });

  it('should pass the proper params to the useUploadQueue hook', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useUploadQueue).toHaveBeenCalledWith({
      inspectionId: props.inspectionId,
      apiConfig: props.apiConfig,
      enableCompliance: props.enableCompliance,
      complianceIssues: props.complianceIssues,
    });

    unmount();
  });

  it('should pass the proper params to the usePictureTaken hook', () => {
    const props = { ...createProps(), tasksBySight: { test: [TaskName.PRICING] } };
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useAddDamageMode).toHaveBeenCalled();
    const addDamageHandle = (useAddDamageMode as jest.Mock).mock.results[0].value;
    expect(usePhotoCaptureSightState).toHaveBeenCalled();
    const sightState = (usePhotoCaptureSightState as jest.Mock).mock.results[0].value;
    expect(useUploadQueue).toHaveBeenCalled();
    const uploadQueue = (useUploadQueue as jest.Mock).mock.results[0].value;
    expect(usePictureTaken).toHaveBeenCalledWith({
      addDamageHandle,
      sightState,
      uploadQueue,
      tasksBySight: props.tasksBySight,
    });

    unmount();
  });

  it('should display a Camera with the given config', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture {...props} />);

    expectPropsOnChildMock(Camera, {
      resolution: props.resolution,
      format: props.format,
      quality: props.quality,
    });

    unmount();
  });

  it('should use the PhotoCaptureHUD component as the Camera HUD', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture {...props} />);

    expectPropsOnChildMock(Camera, { HUDComponent: PhotoCaptureHUD });

    unmount();
  });

  it('should pass the callback from the usePictureTaken hook to the Camera component', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(usePictureTaken).toHaveBeenCalled();
    const handlePictureTaken = (usePictureTaken as jest.Mock).mock.results[0].value;
    expectPropsOnChildMock(Camera, { onPictureTaken: handlePictureTaken });

    unmount();
  });

  it('should pass the proper props to the HUD component', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture showCloseButton={true} {...props} />);

    expect(useAddDamageMode).toHaveBeenCalled();
    const addDamageHandle = (useAddDamageMode as jest.Mock).mock.results[0].value;
    expect(usePhotoCaptureSightState).toHaveBeenCalled();
    const sightState = (usePhotoCaptureSightState as jest.Mock).mock.results[0].value;
    expect(useLoadingState).toHaveBeenCalled();
    const loading = (useLoadingState as jest.Mock).mock.results[0].value;
    expectPropsOnChildMock(Camera, {
      hudProps: {
        sights: props.sights,
        selectedSight: sightState.selectedSight,
        sightsTaken: sightState.sightsTaken,
        lastPictureTaken: sightState.lastPictureTaken,
        mode: addDamageHandle.mode,
        onSelectSight: sightState.selectSight,
        onAddDamage: addDamageHandle.handleAddDamage,
        onCancelAddDamage: addDamageHandle.handleCancelAddDamage,
        onRetry: sightState.retryLoadingInspection,
        loading,
        onClose: props.onClose,
        inspectionId: props.inspectionId,
        showCloseButton: props.showCloseButton,
        onOpenGallery: expect.any(Function),
      },
    });

    unmount();
  });

  it('should sync the local i18n language with the one passed as a prop', () => {
    const props = createProps();
    props.lang = 'fr';
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useI18nSync).toHaveBeenCalledWith(props.lang);

    unmount();
  });

  it('should display the gallery when the gallery button is pressed', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(InspectionGallery).not.toHaveBeenCalled();
    expectPropsOnChildMock(Camera, {
      hudProps: expect.objectContaining({ onOpenGallery: expect.any(Function) }),
    });
    const { onOpenGallery } = (Camera as unknown as jest.Mock).mock.calls[0][0].hudProps;
    expect(InspectionGallery).not.toHaveBeenCalled();
    act(() => onOpenGallery());
    expectPropsOnChildMock(InspectionGallery, {
      inspectionId: props.inspectionId,
      apiConfig: props.apiConfig,
      captureMode: true,
      lang: props.lang,
      showBackButton: true,
      sights: props.sights,
      allowSkipRetake: props.allowSkipRetake,
      enableCompliance: props.enableCompliance,
      complianceIssues: props.complianceIssues,
      onBack: expect.any(Function),
      onNavigateToCapture: expect.any(Function),
      onValidate: expect.any(Function),
    });
    const { onBack } = (InspectionGallery as unknown as jest.Mock).mock.calls[0][0];
    (InspectionGallery as unknown as jest.Mock).mockClear();
    (Camera as unknown as jest.Mock).mockClear();
    expect(Camera).not.toHaveBeenCalled();
    act(() => onBack());
    expect(InspectionGallery).not.toHaveBeenCalled();
    expect(Camera).toHaveBeenCalled();

    unmount();
  });
});

it('should call start tasks on gallery validate', async () => {
  const startTasksMock = jest.fn(() => Promise.resolve());
  (useStartTasksOnComplete as jest.Mock).mockImplementation(() => startTasksMock);
  const props = createProps();
  const { unmount } = render(<PhotoCapture {...props} />);

  expect(InspectionGallery).not.toHaveBeenCalled();
  expectPropsOnChildMock(Camera, {
    hudProps: expect.objectContaining({ onOpenGallery: expect.any(Function) }),
  });
  const { onOpenGallery } = (Camera as unknown as jest.Mock).mock.calls[0][0].hudProps;
  expect(InspectionGallery).not.toHaveBeenCalled();
  act(() => onOpenGallery());
  expectPropsOnChildMock(InspectionGallery, {
    onValidate: expect.any(Function),
  });
  const { onValidate } = (InspectionGallery as unknown as jest.Mock).mock.calls[0][0];

  expect(useMonitoring).toHaveBeenCalled();
  const handleErrorMock = (useMonitoring as jest.Mock).mock.results[0].value.handleError;
  expect(useLoadingState).toHaveBeenCalled();
  const loadingMock = (useLoadingState as jest.Mock).mock.results[0].value;

  expect(startTasksMock).not.toHaveBeenCalled();
  expect(props.onComplete).not.toHaveBeenCalled();
  onValidate();

  await waitFor(() => {
    expect(startTasksMock).toHaveBeenCalled();
    expect(props.onComplete).toHaveBeenCalled();
    expect(loadingMock.onError).not.toHaveBeenCalled();
    expect(handleErrorMock).not.toHaveBeenCalled();
  });

  startTasksMock.mockClear();
  (props.onComplete as jest.Mock).mockClear();
  const err = 'hello';
  startTasksMock.mockImplementation(() => Promise.reject(err));
  onValidate();

  await waitFor(() => {
    expect(startTasksMock).toHaveBeenCalled();
    expect(props.onComplete).not.toHaveBeenCalled();
  });

  unmount();
  (useStartTasksOnComplete as jest.Mock).mockClear();
});
