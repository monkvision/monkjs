import {
  AddDamage,
  CameraResolution,
  ComplianceIssue,
  CompressionFormat,
  ImageType,
  TaskName,
} from '@monkvision/types';

const { CaptureMode } = jest.requireActual('../../src/types');

jest.mock('../../src/DamageDisclosure/hooks', () => ({
  useDamageDisclosureState: jest.fn(() => ({
    lastPictureTakenUri: 'test-uri-test',
    setLastPictureTakenUri: jest.fn(),
    retryLoadingInspection: jest.fn(),
  })),
}));

jest.mock('../../src/hooks', () => ({
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
import { Camera } from '@monkvision/camera-web';
import { useI18nSync, useLoadingState } from '@monkvision/common';
import { BackdropDialog, InspectionGallery } from '@monkvision/common-ui-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { act, render } from '@testing-library/react';
import { DamageDisclosure, DamageDisclosureHUD, DamageDisclosureProps } from '../../src';
import { useDamageDisclosureState } from '../../src/DamageDisclosure/hooks';
import {
  useAdaptiveCameraConfig,
  useAddDamageMode,
  useBadConnectionWarning,
  usePictureTaken,
  useUploadQueue,
  usePhotoCaptureImages,
} from '../../src/hooks';

function createProps(): DamageDisclosureProps {
  return {
    inspectionId: 'test-inspection-test',
    apiConfig: {
      apiDomain: 'test-api-domain-test',
      authToken: 'test-auth-token-test',
      thumbnailDomain: 'test-thumbnail-domain',
    },
    enableCompliance: true,
    useLiveCompliance: true,
    complianceIssues: [ComplianceIssue.INTERIOR_NOT_SUPPORTED],
    customComplianceThresholds: { blurriness: 0.3 },
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
    addDamage: AddDamage.PART_SELECT,
    maxUploadDurationWarning: 456,
  };
}

describe('DamageDisclosure component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass the proper params to the useAdaptiveCameraConfig hook', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosure {...props} />);

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
    const { unmount } = render(<DamageDisclosure {...props} />);

    expect(useAdaptiveCameraConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        useAdaptiveImageQuality: true,
      }),
    );

    unmount();
  });

  it('should pass the proper params to the useDamageDisclosureState hooks', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosure {...props} />);

    expect(useLoadingState).toHaveBeenCalled();
    const loading = (useLoadingState as jest.Mock).mock.results[0].value;
    expect(useDamageDisclosureState).toHaveBeenCalledWith({
      inspectionId: props.inspectionId,
      apiConfig: props.apiConfig,
      loading,
      complianceOptions: {
        enableCompliance: props.enableCompliance,
        useLiveCompliance: props.useLiveCompliance,
        complianceIssues: props.complianceIssues,
        customComplianceThresholds: props.customComplianceThresholds,
      },
    });

    unmount();
  });

  it('should pass the proper params to the useBadConnectionWarning hooks', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosure {...props} />);

    expect(useBadConnectionWarning).toHaveBeenCalledWith({
      maxUploadDurationWarning: props.maxUploadDurationWarning,
    });

    unmount();
  });

  it('should pass the proper params to the useUploadQueue hook', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosure {...props} />);

    expect(useAdaptiveCameraConfig).toHaveBeenCalled();
    const adaptiveConfigEventHandlers = (useAdaptiveCameraConfig as jest.Mock).mock.results[0].value
      .uploadEventHandlers;
    expect(useBadConnectionWarning).toHaveBeenCalled();
    const badConnectionEventHandlers = (useBadConnectionWarning as jest.Mock).mock.results[0].value
      .uploadEventHandlers;
    expect(useUploadQueue).toHaveBeenCalledWith({
      inspectionId: props.inspectionId,
      apiConfig: props.apiConfig,
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
    const { unmount } = render(<DamageDisclosure {...props} />);

    expect(useAddDamageMode).toHaveBeenCalled();
    const addDamageHandle = (useAddDamageMode as jest.Mock).mock.results[0].value;
    expect(useDamageDisclosureState).toHaveBeenCalled();
    const sightState = (useDamageDisclosureState as jest.Mock).mock.results[0].value;
    expect(useUploadQueue).toHaveBeenCalled();
    const uploadQueue = (useUploadQueue as jest.Mock).mock.results[0].value;
    expect(usePictureTaken).toHaveBeenCalledWith({
      addDamageHandle,
      sightState,
      uploadQueue,
      onPictureTaken: props.onPictureTaken,
    });

    unmount();
  });

  it('should display a Camera with the config obtained from the useAdaptiveCameraConfig', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosure {...props} />);

    expect(useAdaptiveCameraConfig).toHaveBeenCalled();
    const { adaptiveCameraConfig } = (useAdaptiveCameraConfig as jest.Mock).mock.results[0].value;
    expectPropsOnChildMock(Camera, adaptiveCameraConfig);

    unmount();
  });

  it('should use the PhotoCaptureHUD component as the Camera HUD', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosure {...props} />);

    expectPropsOnChildMock(Camera, { HUDComponent: DamageDisclosureHUD });

    unmount();
  });

  it('should pass the callback from the usePictureTaken hook to the Camera component', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosure {...props} />);

    expect(usePictureTaken).toHaveBeenCalled();
    const handlePictureTaken = (usePictureTaken as jest.Mock).mock.results[0].value;
    expectPropsOnChildMock(Camera, { onPictureTaken: handlePictureTaken });

    unmount();
  });

  it('should pass the proper props to the HUD component', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosure showCloseButton={true} {...props} />);

    expect(useAddDamageMode).toHaveBeenCalled();
    const addDamageHandle = (useAddDamageMode as jest.Mock).mock.results[0].value;
    expect(useDamageDisclosureState).toHaveBeenCalled();
    const disclosureState = (useDamageDisclosureState as jest.Mock).mock.results[0].value;
    expect(useLoadingState).toHaveBeenCalled();
    const loading = (useLoadingState as jest.Mock).mock.results[0].value;
    const images = (usePhotoCaptureImages as jest.Mock).mock.results[0].value;
    expectPropsOnChildMock(Camera, {
      hudProps: {
        inspectionId: props.inspectionId,
        mode: addDamageHandle.mode,
        vehicleParts: addDamageHandle.vehicleParts,
        lastPictureTakenUri: disclosureState.lastPictureTakenUri,
        onOpenGallery: expect.any(Function),
        onAddDamage: addDamageHandle.handleAddDamage,
        onAddDamagePartsSelected: addDamageHandle.handleAddDamagePartsSelected,
        onCancelAddDamage: addDamageHandle.handleCancelAddDamage,
        loading,
        onClose: props.onClose,
        showCloseButton: props.showCloseButton,
        images,
        addDamage: props.addDamage,
        onRetry: disclosureState.retryLoadingInspection,
        onValidateVehicleParts: addDamageHandle.handleValidateVehicleParts,
      },
    });

    unmount();
  });

  it('should sync the local i18n language with the one passed as a prop', () => {
    const props = createProps();
    props.lang = 'fr';
    const { unmount } = render(<DamageDisclosure {...props} />);

    expect(useI18nSync).toHaveBeenCalledWith(props.lang);

    unmount();
  });

  it('should display the gallery when the gallery button is pressed', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosure {...props} />);

    expect(InspectionGallery).not.toHaveBeenCalled();
    expectPropsOnChildMock(Camera, {
      hudProps: expect.objectContaining({ onOpenGallery: expect.any(Function) }),
    });
    const { onOpenGallery } = (Camera as unknown as jest.Mock).mock.calls[0][0].hudProps;
    expect(InspectionGallery).not.toHaveBeenCalled();
    act(() => onOpenGallery());
    expectPropsOnChildMock(InspectionGallery, {
      inspectionId: props.inspectionId,
      sights: [],
      apiConfig: props.apiConfig,
      captureMode: true,
      lang: props.lang,
      showBackButton: true,
      onBack: expect.any(Function),
      onNavigateToCapture: expect.any(Function),
      onValidate: expect.any(Function),
      addDamage: props.addDamage,
      validateButtonLabel: 'photo.gallery.next',
      isInspectionCompleted: false,
      filterByImageType: ImageType.CLOSE_UP,
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
    const { unmount } = render(<DamageDisclosure {...props} />);

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
