import { Image, ImageStatus } from '@monkvision/types';

jest.mock('../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight', () => ({
  PhotoCaptureHUDPreviewSight: jest.fn(() => <></>),
}));
jest.mock(
  '../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDPreviewAddDamage1stShot',
  () => ({
    PhotoCaptureHUDPreviewAddDamage1stShot: jest.fn(() => <></>),
  }),
);
jest.mock(
  '../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDPreviewAddDamage2ndShot',
  () => ({
    PhotoCaptureHUDPreviewAddDamage2ndShot: jest.fn(() => <></>),
  }),
);

import { sights } from '@monkvision/sights';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { PhotoCaptureMode } from '../../../src/PhotoCapture/hooks';
import {
  PhotoCaptureHUDPreview,
  PhotoCaptureHUDPreviewAddDamage1stShot,
  PhotoCaptureHUDPreviewAddDamage2ndShot,
  PhotoCaptureHUDPreviewProps,
  PhotoCaptureHUDPreviewSight,
} from '../../../src';

function createProps(): PhotoCaptureHUDPreviewProps {
  const captureSights = [sights['test-sight-1'], sights['test-sight-2'], sights['test-sight-3']];
  return {
    selectedSight: captureSights[1],
    sights: captureSights,
    sightsTaken: [captureSights[0]],
    mode: PhotoCaptureMode.SIGHT,
    onAddDamage: jest.fn(),
    onCancelAddDamage: jest.fn(),
    onSelectSight: jest.fn(),
    streamDimensions: { height: 1234, width: 45678 },
    isLoading: false,
    error: null,
    images: [
      { additionalData: { sight_id: 'test-sight-1' }, status: ImageStatus.NOT_COMPLIANT },
    ] as Image[],
  };
}

describe('PhotoCaptureHUDPreview component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if the capture is loading', () => {
    const props = createProps();
    props.isLoading = true;
    const { container, unmount } = render(<PhotoCaptureHUDPreview {...props} />);

    expect(container).toBeEmptyDOMElement();

    unmount();
  });

  it('should return null if the capture is in error', () => {
    const props = createProps();
    props.error = true;
    const { container, unmount } = render(<PhotoCaptureHUDPreview {...props} />);

    expect(container).toBeEmptyDOMElement();

    unmount();
  });

  it('should return the PhotoCaptureHUDPreviewSight component if the mode is Sight', () => {
    const props = createProps();
    props.mode = PhotoCaptureMode.SIGHT;
    const { unmount } = render(<PhotoCaptureHUDPreview {...props} />);

    expectPropsOnChildMock(PhotoCaptureHUDPreviewSight, {
      sights: props.sights,
      selectedSight: props.selectedSight,
      onSelectedSight: props.onSelectSight,
      sightsTaken: props.sightsTaken,
      onAddDamage: props.onAddDamage,
      streamDimensions: props.streamDimensions,
      images: props.images,
    });
    expect(PhotoCaptureHUDPreviewAddDamage1stShot).not.toHaveBeenCalled();
    expect(PhotoCaptureHUDPreviewAddDamage2ndShot).not.toHaveBeenCalled();

    unmount();
  });

  it('should return the PhotoCaptureHUDPreviewAddDamage1stShot component if the mode is AD 1st Shot', () => {
    const props = createProps();
    props.mode = PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT;
    const { unmount } = render(<PhotoCaptureHUDPreview {...props} />);

    expectPropsOnChildMock(PhotoCaptureHUDPreviewAddDamage1stShot, {
      onCancel: props.onCancelAddDamage,
    });
    expect(PhotoCaptureHUDPreviewSight).not.toHaveBeenCalled();
    expect(PhotoCaptureHUDPreviewAddDamage2ndShot).not.toHaveBeenCalled();

    unmount();
  });

  it('should return the PhotoCaptureHUDPreviewAddDamage1stShot component if the mode is AD 2nd Shot', () => {
    const props = createProps();
    props.mode = PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT;
    const { unmount } = render(<PhotoCaptureHUDPreview {...props} />);

    expectPropsOnChildMock(PhotoCaptureHUDPreviewAddDamage2ndShot, {
      onCancel: props.onCancelAddDamage,
    });
    expect(PhotoCaptureHUDPreviewSight).not.toHaveBeenCalled();
    expect(PhotoCaptureHUDPreviewAddDamage1stShot).not.toHaveBeenCalled();

    unmount();
  });
});
