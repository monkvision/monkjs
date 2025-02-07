jest.mock('../../../src/PhotoCapture/PhotoCaptureHUD/hooks', () => ({
  ...jest.requireActual('../../../src/PhotoCapture/PhotoCaptureHUD/hooks'),
  useComplianceNotification: jest.fn(() => false),
}));
jest.mock('../../../src/components', () => ({
  HUDButtons: jest.fn(() => <></>),
  HUDOverlay: jest.fn(() => <></>),
  OrientationEnforcer: jest.fn(() => <></>),
}));
jest.mock('../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElements', () => ({
  PhotoCaptureHUDElements: jest.fn(() => <></>),
}));

import { useTranslation } from 'react-i18next';
import { act, render, screen } from '@testing-library/react';
import { sights } from '@monkvision/sights';
import { LoadingState } from '@monkvision/common';
import { CameraHandle } from '@monkvision/camera-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { BackdropDialog } from '@monkvision/common-ui-web';
import { PhotoCaptureHUD, PhotoCaptureHUDElements, PhotoCaptureHUDProps } from '../../../src';
import { HUDButtons, HUDOverlay, OrientationEnforcer } from '../../../src/components';
import { CaptureMode } from '../../../src/types';
import { ImageStatus, Image, DeviceOrientation, VehicleType } from '@monkvision/types';

const cameraTestId = 'camera-test-id';

function createProps(): PhotoCaptureHUDProps {
  return {
    inspectionId: 'test-inspection-id-test',
    sights: [
      sights['test-sight-1'],
      sights['test-sight-2'],
      sights['test-sight-3'],
      sights['test-sight-4'],
    ],
    selectedSight: sights['test-sight-2'],
    sightsTaken: [sights['test-sight-1']],
    lastPictureTakenUri: 'test-last-pic-taken',
    mode: CaptureMode.SIGHT,
    loading: { isLoading: false, error: null } as unknown as LoadingState,
    onSelectSight: jest.fn(),
    onRetakeSight: jest.fn(),
    onAddDamage: jest.fn(),
    onCancelAddDamage: jest.fn(),
    onRetry: jest.fn(),
    onClose: jest.fn(),
    onOpenGallery: jest.fn(),
    showCloseButton: true,
    handle: {
      isLoading: false,
      error: null,
      dimensions: { height: 2, width: 4 },
      previewDimensions: { height: 111, width: 2222 },
    } as unknown as CameraHandle,
    cameraPreview: <div data-testid={cameraTestId}></div>,
    images: [{ sightId: 'test-sight-1', status: ImageStatus.NOT_COMPLIANT }] as Image[],
    currentTutorialStep: null,
    allowSkipTutorial: false,
    onNextTutorialStep: jest.fn(),
    onCloseTutorial: jest.fn(),
    enforceOrientation: DeviceOrientation.PORTRAIT,
    onValidateVehicleParts: jest.fn(),
    vehicleParts: [],
    vehicleType: VehicleType.SEDAN,
    showSightGuidelines: true,
    onDisableSightGuidelines: jest.fn(),
  };
}

describe('PhotoCaptureHUD component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the camera preview on the screen', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    expect(screen.queryByTestId(cameraTestId)).not.toBeNull();

    unmount();
  });

  it('should display the PhotoCaptureHUDElements component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    expectPropsOnChildMock(PhotoCaptureHUDElements, {
      selectedSight: props.selectedSight,
      sights: props.sights,
      sightsTaken: props.sightsTaken,
      mode: props.mode,
      onAddDamage: props.onAddDamage,
      onCancelAddDamage: props.onCancelAddDamage,
      onSelectSight: props.onSelectSight,
      isLoading: props.loading.isLoading || props.handle.isLoading,
      error: props.loading.error ?? props.handle.error,
      previewDimensions: props.handle.previewDimensions,
      images: props.images,
    });

    unmount();
  });

  it('should display the PhotoCaptureHUDButtons component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    expectPropsOnChildMock(HUDButtons, {
      onTakePicture: props.handle?.takePicture,
      galleryPreview: props.lastPictureTakenUri ?? undefined,
      closeDisabled: !!props.loading.error || !!props.handle.error,
      galleryDisabled: !!props.loading.error || !!props.handle.error,
      takePictureDisabled: !!props.loading.error || !!props.handle.error,
      showCloseButton: props.showCloseButton,
      onOpenGallery: props.onOpenGallery,
    });

    unmount();
  });

  it('should display the HUDOverlay component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    expectPropsOnChildMock(HUDOverlay, {
      inspectionId: props.inspectionId,
      handle: props.handle,
      isCaptureLoading: props.loading.isLoading,
      captureError: props.loading.error,
      onRetry: props.onRetry,
    });

    unmount();
  });

  it('should display the BackdropDialog component with the proper props', () => {
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ t: jest.fn((v) => v) }));
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    expectPropsOnChildMock(BackdropDialog, {
      message: 'photo.hud.closeConfirm.message',
      cancelLabel: 'photo.hud.closeConfirm.cancel',
      confirmLabel: 'photo.hud.closeConfirm.confirm',
    });

    unmount();
  });

  it('should properly handle the click on close event', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    const { onClose } = (HUDButtons as jest.Mock).mock.calls[0][0];
    expectPropsOnChildMock(BackdropDialog, { show: false });
    jest.clearAllMocks();

    act(() => onClose());
    expectPropsOnChildMock(BackdropDialog, { show: true });
    const { onConfirm } = (BackdropDialog as jest.Mock).mock.calls[0][0];
    jest.clearAllMocks();

    expect(props.onClose).not.toHaveBeenCalled();
    act(() => onConfirm());
    expectPropsOnChildMock(BackdropDialog, { show: false });
    expect(props.onClose).toHaveBeenCalled();

    unmount();
  });

  const RETAKE_STATUSES = [
    ImageStatus.NOT_COMPLIANT,
    ImageStatus.UPLOAD_FAILED,
    ImageStatus.UPLOAD_ERROR,
  ];

  RETAKE_STATUSES.forEach((status) => {
    it(`should display the gallery badge if there are images with the ${status} status`, () => {
      const props = createProps();
      props.images = [{ status }, { status }, { status: 'test' }] as Image[];
      const { unmount } = render(<PhotoCaptureHUD {...props} />);

      expectPropsOnChildMock(HUDButtons, { showGalleryBadge: true, retakeCount: 2 });

      unmount();
    });
  });

  it('should not display the gallery badge if there are no images with retake statuses', () => {
    const props = createProps();
    props.images = Object.values(ImageStatus)
      .filter((status) => !RETAKE_STATUSES.includes(status))
      .map((status) => ({ status } as Image));
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    expectPropsOnChildMock(HUDButtons, { showGalleryBadge: false, retakeCount: 0 });

    unmount();
  });

  it('should pass the enforceOrientation prop to the OrientationEnforcer', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    expectPropsOnChildMock(OrientationEnforcer, { orientation: props.enforceOrientation });

    unmount();
  });
});
