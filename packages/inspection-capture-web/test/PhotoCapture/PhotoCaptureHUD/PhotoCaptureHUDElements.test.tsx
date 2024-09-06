import { AddDamage, Image, ImageStatus } from '@monkvision/types';

jest.mock('../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsSight', () => ({
  PhotoCaptureHUDElementsSight: jest.fn(() => <></>),
}));
jest.mock(
  '../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsAddDamage1stShot',
  () => ({
    PhotoCaptureHUDElementsAddDamage1stShot: jest.fn(() => <></>),
  }),
);
jest.mock(
  '../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsAddDamage2ndShot',
  () => ({
    PhotoCaptureHUDElementsAddDamage2ndShot: jest.fn(() => <></>),
  }),
);

jest.mock(
  '../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsAddPartSelectShot',
  () => ({
    PhotoCaptureHUDElementsAddPartSelectShot: jest.fn(() => <></>),
  }),
);

import { sights } from '@monkvision/sights';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { PhotoCaptureMode } from '../../../src/PhotoCapture/hooks';
import {
  PhotoCaptureHUDElements,
  PhotoCaptureHUDElementsAddDamage1stShot,
  PhotoCaptureHUDElementsAddDamage2ndShot,
  PhotoCaptureHUDElementsProps,
  PhotoCaptureHUDElementsSight,
} from '../../../src';
import { PhotoCaptureHUDElementsAddPartSelectShot } from '../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsAddPartSelectShot';

function createProps(): PhotoCaptureHUDElementsProps {
  const captureSights = [sights['test-sight-1'], sights['test-sight-2'], sights['test-sight-3']];
  return {
    selectedSight: captureSights[1],
    sights: captureSights,
    sightsTaken: [captureSights[0]],
    mode: PhotoCaptureMode.SIGHT,
    onAddDamage: jest.fn(),
    onCancelAddDamage: jest.fn(),
    onSelectSight: jest.fn(),
    onRetakeSight: jest.fn(),
    previewDimensions: { height: 1234, width: 45678 },
    isLoading: false,
    error: null,
    images: [{ sightId: 'test-sight-1', status: ImageStatus.NOT_COMPLIANT }] as Image[],
    tutorialStep: null,
    addDamage: AddDamage.TWO_SHOT,
    onAddDamageParts: jest.fn(),
  };
}

describe('PhotoCaptureHUDElements component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if the capture is loading', () => {
    const props = createProps();
    props.isLoading = true;
    const { container, unmount } = render(<PhotoCaptureHUDElements {...props} />);

    expect(container).toBeEmptyDOMElement();

    unmount();
  });

  it('should return null if the capture is in error', () => {
    const props = createProps();
    props.error = true;
    const { container, unmount } = render(<PhotoCaptureHUDElements {...props} />);

    expect(container).toBeEmptyDOMElement();

    unmount();
  });

  it('should return the PhotoCaptureHUDElementsSight component if the mode is Sight', () => {
    const props = createProps();
    props.mode = PhotoCaptureMode.SIGHT;
    const { unmount } = render(<PhotoCaptureHUDElements {...props} />);

    expectPropsOnChildMock(PhotoCaptureHUDElementsSight, {
      sights: props.sights,
      selectedSight: props.selectedSight,
      onSelectedSight: props.onSelectSight,
      sightsTaken: props.sightsTaken,
      onAddDamage: props.onAddDamage,
      previewDimensions: props.previewDimensions,
      images: props.images,
    });
    expect(PhotoCaptureHUDElementsAddDamage1stShot).not.toHaveBeenCalled();
    expect(PhotoCaptureHUDElementsAddDamage2ndShot).not.toHaveBeenCalled();

    unmount();
  });

  it('should return the PhotoCaptureHUDElementsAddDamage1stShot component if the mode is AD 1st Shot', () => {
    const props = createProps();
    props.mode = PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT;
    const { unmount } = render(<PhotoCaptureHUDElements {...props} />);

    expectPropsOnChildMock(PhotoCaptureHUDElementsAddDamage1stShot, {
      onCancel: props.onCancelAddDamage,
    });
    expect(PhotoCaptureHUDElementsSight).not.toHaveBeenCalled();
    expect(PhotoCaptureHUDElementsAddDamage2ndShot).not.toHaveBeenCalled();

    unmount();
  });

  it('should return the PhotoCaptureHUDElementsAddDamage1stShot component if the mode is AD 2nd Shot', () => {
    const props = createProps();
    props.mode = PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT;
    const { unmount } = render(<PhotoCaptureHUDElements {...props} />);

    expectPropsOnChildMock(PhotoCaptureHUDElementsAddDamage2ndShot, {
      onCancel: props.onCancelAddDamage,
    });
    expect(PhotoCaptureHUDElementsSight).not.toHaveBeenCalled();
    expect(PhotoCaptureHUDElementsAddDamage1stShot).not.toHaveBeenCalled();

    unmount();
  });
  it('should return the PhotoCaptureHUDElementsAddPartSelectShot componet if the mode is part select', () => {
    const props = createProps();
    props.mode = PhotoCaptureMode.ADD_DAMAGE_PART_SELECT;
    render(<PhotoCaptureHUDElements {...props} />);
    expectPropsOnChildMock(PhotoCaptureHUDElementsAddPartSelectShot, {
      onCancel: props.onCancelAddDamage,
      onAddDamageParts: props.onAddDamageParts,
    });
    expect(PhotoCaptureHUDElementsSight).not.toHaveBeenCalled();
    expect(PhotoCaptureHUDElementsAddDamage1stShot).not.toHaveBeenCalled();
  });
});
