import { sights } from '@monkvision/sights';
import {
  AddDamage,
  CameraResolution,
  ComplianceIssue,
  CompressionFormat,
  DeviceOrientation,
  PhotoCaptureTutorialOption,
  PhotoCaptureSightGuidelinesOption,
  TaskName,
  VehicleType,
} from '@monkvision/types';
import { Camera } from '@monkvision/camera-web';
import { useI18nSync, useLoadingState } from '@monkvision/common';
import { BackdropDialog, InspectionGallery } from '@monkvision/common-ui-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { act, render } from '@testing-library/react';
import { PhotoCapture, PhotoCaptureHUD, PhotoCaptureProps } from '../../src';
import {
  usePhotoCaptureSightState,
  usePhotoCaptureTutorial,
  usePhotoCaptureSightGuidelines,
} from '../../src/PhotoCapture/hooks';
import {
  useStartTasksOnComplete,
  useAdaptiveCameraConfig,
  useAddDamageMode,
  useBadConnectionWarning,
  usePhotoCaptureImages,
  usePictureTaken,
  useUploadQueue,
} from '../../src/hooks';

const { CaptureMode } = jest.requireActual('../../src/types');

jest.mock('../../src/PhotoCapture/hooks', () => ({
  usePhotoCaptureSightState: jest.fn(() => ({
    selectedSight: sights['test-sight-2'],
    sightsTaken: [sights['test-sight-1']],
    selectSight: jest.fn(),
    takeSelectedSight: jest.fn(),
    lastPictureTakenUri: 'test-uri-test',
    setLastPictureTakenUri: jest.fn(),
    retryLoadingInspection: jest.fn(),
    handleInspectionCompleted: jest.fn(),
  })),
  useComplianceAnalytics: jest.fn(() => ({
    isInitialInspectionFetched: jest.fn(),
  })),
  usePhotoCaptureTutorial: jest.fn(() => ({
    currentTutorialStep: 'welcome',
    goToNextTutorialStep: jest.fn(),
    closeTutorial: jest.fn(),
  })),
  usePhotoCaptureSightGuidelines: jest.fn(() => ({
    showSightGuidelines: true,
  })),
}));

jest.mock('../../src/hooks', () => ({
  useStartTasksOnComplete: jest.fn(() => jest.fn()),
  useAddDamageMode: jest.fn(() => ({
    mode: CaptureMode.SIGHT,
    handleAddDamage: jest.fn(),
    updatePhotoCaptureModeAfterPictureTaken: jest.fn(),
    handleCancelAddDamage: jest.fn(),
  })),
  usePhotoCaptureImages: jest.fn(() => [{ id: 'test' }]),
  usePictureTaken: jest.fn(() => jest.fn()),
  useUploadQueue: jest.fn(() => ({
    length: 3,
  })),
  useBadConnectionWarning: jest.fn(() => ({
    isBadConnectionWarningDialogDisplayed: true,
    closeBadConnectionWarningDialog: jest.fn(),
    uploadEventHandlers: {
      onUploadSuccess: jest.fn(),
      onUploadTimeout: jest.fn(),
    },
  })),
  useAdaptiveCameraConfig: jest.fn(() => ({
    adaptiveCameraConfig: {
      resolution: CameraResolution.QHD_2K,
      format: CompressionFormat.JPEG,
      allowImageUpscaling: false,
      quality: 0.9,
    },
    uploadEventHandlers: {
      onUploadSuccess: jest.fn(),
      onUploadTimeout: jest.fn(),
    },
  })),
  useTracking: jest.fn(),
}));

function createProps(): PhotoCaptureProps {
  return {
    sights: [sights['test-sight-1'], sights['test-sight-2'], sights['test-sight-3']],
    inspectionId: 'test-inspection-test',
    apiConfig: {
      apiDomain: 'test-api-domain-test',
      authToken: 'test-auth-token-test',
      thumbnailDomain: 'test-thumbnail-domain',
    },
    enforceOrientation: DeviceOrientation.PORTRAIT,
    additionalTasks: [TaskName.DASHBOARD_OCR],
    tasksBySight: { 'test-sight-1': [TaskName.IMAGE_EDITING] },
    startTasksOnComplete: [TaskName.COMPLIANCES],
    enableCompliance: true,
    enableCompliancePerSight: ['test-sight-id'],
    useLiveCompliance: true,
    complianceIssues: [ComplianceIssue.INTERIOR_NOT_SUPPORTED],
    complianceIssuesPerSight: { test: [ComplianceIssue.OVEREXPOSURE] },
    customComplianceThresholds: { blurriness: 0.3 },
    customComplianceThresholdsPerSight: { test: { overexposure: 0.6 } },
    onClose: jest.fn(),
    onComplete: jest.fn(),
    onPictureTaken: jest.fn(),
    resolution: CameraResolution.NHD_360P,
    format: CompressionFormat.JPEG,
    quality: 0.4,
    showCloseButton: true,
    lang: 'de',
    allowImageUpscaling: true,
    useAdaptiveImageQuality: false,
    allowSkipRetake: true,
    addDamage: AddDamage.PART_SELECT,
    maxUploadDurationWarning: 456,
    enableSightGuidelines: PhotoCaptureSightGuidelinesOption.ENABLED,
    sightGuidelines: [
      {
        en: 'en-test',
        fr: 'fr-test',
        de: 'de-test',
        nl: 'nl-test',
        sightIds: ['sightId-test-1', 'sightId-test-2'],
      },
    ],
    enableTutorial: PhotoCaptureTutorialOption.ENABLED,
    allowSkipTutorial: true,
    enableSightTutorial: true,
    vehicleType: VehicleType.SEDAN,
    enableAutoComplete: false,
  };
}

describe('PhotoCapture component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass the proper params to the useAdaptiveCameraConfig hook', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useAdaptiveCameraConfig).toHaveBeenCalledWith({
      initialCameraConfig: expect.objectContaining({
        quality: props.quality,
        format: props.format,
        resolution: props.resolution,
        allowImageUpscaling: props.allowImageUpscaling,
      }),
      useAdaptiveImageQuality: props.useAdaptiveImageQuality,
    });

    unmount();
  });

  it('should use adaptive image quality by default', () => {
    const props = createProps();
    props.useAdaptiveImageQuality = undefined;
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useAdaptiveCameraConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        useAdaptiveImageQuality: true,
      }),
    );

    unmount();
  });

  it('should pass the proper params to the useStartTasksOnComplete hook', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useLoadingState).toHaveBeenCalled();
    const loading = (useLoadingState as jest.Mock).mock.results[0].value;
    expect(useStartTasksOnComplete).toHaveBeenCalledWith({
      inspectionId: props.inspectionId,
      apiConfig: props.apiConfig,
      sights: props.sights,
      additionalTasks: props.additionalTasks,
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
    const startTasks = (useStartTasksOnComplete as jest.Mock).mock.results[0].value;
    expect(usePhotoCaptureSightState).toHaveBeenCalledWith({
      inspectionId: props.inspectionId,
      captureSights: props.sights,
      apiConfig: props.apiConfig,
      loading,
      onLastSightTaken: expect.any(Function),
      tasksBySight: props.tasksBySight,
      startTasks,
      onComplete: props.onComplete,
      enableAutoComplete: props.enableAutoComplete,
      complianceOptions: {
        enableCompliance: props.enableCompliance,
        enableCompliancePerSight: props.enableCompliancePerSight,
        useLiveCompliance: props.useLiveCompliance,
        complianceIssues: props.complianceIssues,
        complianceIssuesPerSight: props.complianceIssuesPerSight,
        customComplianceThresholds: props.customComplianceThresholds,
        customComplianceThresholdsPerSight: props.customComplianceThresholdsPerSight,
      },
    });

    unmount();
  });

  it('should pass the proper params to the useBadConnectionWarning hooks', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useBadConnectionWarning).toHaveBeenCalledWith({
      maxUploadDurationWarning: props.maxUploadDurationWarning,
    });

    unmount();
  });

  it('should pass the proper params to the useUploadQueue hook', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useAdaptiveCameraConfig).toHaveBeenCalled();
    const adaptiveConfigEventHandlers = (useAdaptiveCameraConfig as jest.Mock).mock.results[0].value
      .uploadEventHandlers;
    expect(useBadConnectionWarning).toHaveBeenCalled();
    const badConnectionEventHandlers = (useBadConnectionWarning as jest.Mock).mock.results[0].value
      .uploadEventHandlers;
    expect(useUploadQueue).toHaveBeenCalledWith({
      inspectionId: props.inspectionId,
      apiConfig: props.apiConfig,
      additionalTasks: props.additionalTasks,
      complianceOptions: {
        enableCompliance: props.enableCompliance,
        enableCompliancePerSight: props.enableCompliancePerSight,
        complianceIssues: props.complianceIssues,
        complianceIssuesPerSight: props.complianceIssuesPerSight,
        useLiveCompliance: props.useLiveCompliance,
        customComplianceThresholds: props.customComplianceThresholds,
        customComplianceThresholdsPerSight: props.customComplianceThresholdsPerSight,
      },
      eventHandlers: expect.arrayContaining([
        adaptiveConfigEventHandlers,
        badConnectionEventHandlers,
      ]),
    });

    unmount();
  });

  it('should pass the proper params to the usePictureTaken hook', () => {
    const props = { ...createProps(), tasksBySight: { test: [TaskName.PRICING] } };
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useAddDamageMode).toHaveBeenCalled();
    const addDamageHandle = (useAddDamageMode as jest.Mock).mock.results[0].value;
    expect(usePhotoCaptureSightState).toHaveBeenCalled();
    const captureState = (usePhotoCaptureSightState as jest.Mock).mock.results[0].value;
    expect(useUploadQueue).toHaveBeenCalled();
    const uploadQueue = (useUploadQueue as jest.Mock).mock.results[0].value;
    expect(usePictureTaken).toHaveBeenCalledWith({
      addDamageHandle,
      captureState,
      uploadQueue,
      tasksBySight: props.tasksBySight,
      onPictureTaken: props.onPictureTaken,
    });

    unmount();
  });

  it('should display a Camera with the config obtained from the useAdaptiveCameraConfig', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useAdaptiveCameraConfig).toHaveBeenCalled();
    const { adaptiveCameraConfig } = (useAdaptiveCameraConfig as jest.Mock).mock.results[0].value;
    expectPropsOnChildMock(Camera, adaptiveCameraConfig);

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
    expect(usePhotoCaptureImages).toHaveBeenCalledWith(props.inspectionId);
    const images = (usePhotoCaptureImages as jest.Mock).mock.results[0].value;
    const tutorial = (usePhotoCaptureTutorial as jest.Mock).mock.results[0].value;
    const sightGuidelines = (usePhotoCaptureSightGuidelines as jest.Mock).mock.results[0].value;
    expectPropsOnChildMock(Camera, {
      hudProps: {
        sights: props.sights,
        selectedSight: sightState.selectedSight,
        sightsTaken: sightState.sightsTaken,
        lastPictureTakenUri: sightState.lastPictureTakenUri,
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
        images,
        addDamage: props.addDamage,
        sightGuidelines: props.sightGuidelines,
        currentTutorialStep: tutorial.currentTutorialStep,
        onNextTutorialStep: tutorial.goToNextTutorialStep,
        onCloseTutorial: tutorial.closeTutorial,
        allowSkipTutorial: props.allowSkipRetake,
        enforceOrientation: props.enforceOrientation,
        vehicleType: props.vehicleType,
        showSightGuidelines: sightGuidelines.showSightGuidelines,
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
      enableCompliancePerSight: props.enableCompliancePerSight,
      useLiveCompliance: props.useLiveCompliance,
      complianceIssues: props.complianceIssues,
      complianceIssuesPerSight: props.complianceIssuesPerSight,
      customComplianceThresholds: props.customComplianceThresholds,
      customComplianceThresholdsPerSight: props.customComplianceThresholdsPerSight,
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

  it('should pass the proper params to the BackdropDialog component', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCapture {...props} />);

    expect(useBadConnectionWarning).toHaveBeenCalled();
    const { isBadConnectionWarningDialogDisplayed, closeBadConnectionWarningDialog } = (
      useBadConnectionWarning as jest.Mock
    ).mock.results[0].value;
    expectPropsOnChildMock(BackdropDialog, {
      show: isBadConnectionWarningDialogDisplayed,
      dialogIcon: 'warning-outline',
      dialogIconPrimaryColor: 'caution-base',
      message: 'photo.badConnectionWarning.message',
      confirmLabel: 'photo.badConnectionWarning.confirm',
      onConfirm: expect.any(Function),
    });
    const { onConfirm } = (BackdropDialog as unknown as jest.Mock).mock.calls[0][0];
    expect(closeBadConnectionWarningDialog).not.toHaveBeenCalled();
    onConfirm();
    expect(closeBadConnectionWarningDialog).toHaveBeenCalled();

    unmount();
  });
});
