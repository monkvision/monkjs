import { AddDamage, Image, ImageStatus } from '@monkvision/types';

jest.mock('../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsSight', () => ({
  PhotoCaptureHUDElementsSight: jest.fn(() => <></>),
}));
jest.mock('../../../src/components/ZoomOutShot', () => ({
  ZoomOutShot: jest.fn(() => <></>),
}));
jest.mock('../../../src/components/CloseUpShot', () => ({
  CloseUpShot: jest.fn(() => <></>),
}));

import { sights } from '@monkvision/sights';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { CaptureMode } from '../../../src/types';
import {
  PhotoCaptureHUDElements,
  PhotoCaptureHUDElementsProps,
  PhotoCaptureHUDElementsSight,
} from '../../../src';
import { ZoomOutShot, CloseUpShot } from '../../../src/components';

function createProps(): PhotoCaptureHUDElementsProps {
  const captureSights = [sights['test-sight-1'], sights['test-sight-2'], sights['test-sight-3']];
  return {
    selectedSight: captureSights[1],
    sights: captureSights,
    sightsTaken: [captureSights[0]],
    mode: CaptureMode.SIGHT,
    onAddDamage: jest.fn(),
    onCancelAddDamage: jest.fn(),
    onSelectSight: jest.fn(),
    onRetakeSight: jest.fn(),
    previewDimensions: { height: 1234, width: 45678 },
    isLoading: false,
    error: null,
    images: [{ sightId: 'test-sight-1', status: ImageStatus.NOT_COMPLIANT }] as Image[],
    tutorialStep: null,
    onValidateVehicleParts: jest.fn(),
    vehicleParts: [],
    addDamage: AddDamage.PART_SELECT,
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
    props.mode = CaptureMode.SIGHT;
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
    expect(ZoomOutShot).not.toHaveBeenCalled();
    expect(CloseUpShot).not.toHaveBeenCalled();

    unmount();
  });

  it('should return the PhotoCaptureHUDElementsAddDamage1stShot component if the mode is AD 1st Shot', () => {
    const props = createProps();
    props.mode = CaptureMode.ADD_DAMAGE_1ST_SHOT;
    const { unmount } = render(<PhotoCaptureHUDElements {...props} />);

    expectPropsOnChildMock(ZoomOutShot, {
      onCancel: props.onCancelAddDamage,
    });
    expect(PhotoCaptureHUDElementsSight).not.toHaveBeenCalled();
    expect(CloseUpShot).not.toHaveBeenCalled();

    unmount();
  });

  it('should return the PhotoCaptureHUDElementsAddDamage1stShot component if the mode is AD 2nd Shot', () => {
    const props = createProps();
    props.mode = CaptureMode.ADD_DAMAGE_2ND_SHOT;
    const { unmount } = render(<PhotoCaptureHUDElements {...props} />);

    expectPropsOnChildMock(CloseUpShot, {
      onCancel: props.onCancelAddDamage,
    });
    expect(PhotoCaptureHUDElementsSight).not.toHaveBeenCalled();
    expect(ZoomOutShot).not.toHaveBeenCalled();

    unmount();
  });
});
