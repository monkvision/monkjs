jest.mock('../../../src/components/HUDButtons', () => ({
  HUDButtons: jest.fn(() => <></>),
}));
jest.mock('../../../src/DamageDisclosure/DamageDisclosureHUD/DamageDisclosureHUDElements', () => ({
  DamageDisclosureHUDElements: jest.fn(() => <></>),
}));

import { useTranslation } from 'react-i18next';
import { act, render, screen } from '@testing-library/react';
import { LoadingState } from '@monkvision/common';
import { Image, ImageStatus, VehicleType } from '@monkvision/types';
import { CameraHandle } from '@monkvision/camera-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { BackdropDialog } from '@monkvision/common-ui-web';
import {
  DamageDisclosureHUD,
  DamageDisclosureHUDElements,
  DamageDisclosureHUDProps,
} from '../../../src';
import { HUDButtons } from '../../../src/components';
import { CaptureMode } from '../../../src/types';

const cameraTestId = 'camera-test-id';

function createProps(): DamageDisclosureHUDProps {
  return {
    inspectionId: 'test-inspection-id-test',
    lastPictureTakenUri: 'test-last-pic-taken',
    mode: CaptureMode.SIGHT,
    loading: { isLoading: false, error: null } as unknown as LoadingState,
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
    onValidateVehicleParts: jest.fn(),
    vehicleParts: [],
    vehicleType: VehicleType.SEDAN,
  };
}

describe('DamageDisclosureHUD component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the camera preview on the screen', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosureHUD {...props} />);

    expect(screen.queryByTestId(cameraTestId)).not.toBeNull();

    unmount();
  });

  it('should display the DamageDisclosureHUDElements component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosureHUD {...props} />);

    expectPropsOnChildMock(DamageDisclosureHUDElements, {
      mode: props.mode,
      vehicleParts: props.vehicleParts,
      onAddDamage: props.onAddDamage,
      onCancelAddDamage: props.onCancelAddDamage,
      onAddDamagePartsSelected: props.onAddDamagePartsSelected,
      onValidateVehicleParts: props.onValidateVehicleParts,
      isLoading: props.loading.isLoading || props.handle.isLoading,
      error: props.loading.error ?? props.handle.error,
      previewDimensions: props.handle.previewDimensions,
    });

    unmount();
  });

  it('should display the HUDButtons component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosureHUD {...props} />);

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

  it('should display the BackdropDialog component with the proper props', () => {
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ t: jest.fn((v) => v) }));
    const props = createProps();
    const { unmount } = render(<DamageDisclosureHUD {...props} />);

    expectPropsOnChildMock(BackdropDialog, {
      message: 'photo.hud.closeConfirm.message',
      cancelLabel: 'photo.hud.closeConfirm.cancel',
      confirmLabel: 'photo.hud.closeConfirm.confirm',
    });

    unmount();
  });

  it('should properly handle the click on close event', () => {
    const props = createProps();
    const { unmount } = render(<DamageDisclosureHUD {...props} />);

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
      const { unmount } = render(<DamageDisclosureHUD {...props} />);

      expectPropsOnChildMock(HUDButtons, { showGalleryBadge: false, retakeCount: 0 });

      unmount();
    });
  });

  it('should not display the gallery badge if there are no images with retake statuses', () => {
    const props = createProps();
    props.images = Object.values(ImageStatus)
      .filter((status) => !RETAKE_STATUSES.includes(status))
      .map((status) => ({ status } as Image));
    const { unmount } = render(<DamageDisclosureHUD {...props} />);

    expectPropsOnChildMock(HUDButtons, { showGalleryBadge: false, retakeCount: 0 });

    unmount();
  });
});
