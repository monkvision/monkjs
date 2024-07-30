import { Image, ImageStatus } from '@monkvision/types';

jest.mock('../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDCounter', () => ({
  PhotoCaptureHUDCounter: jest.fn(() => <></>),
}));
jest.mock(
  '../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsSight/AddDamageButton',
  () => ({
    AddDamageButton: jest.fn(() => <></>),
  }),
);
jest.mock(
  '../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsSight/SightSlider',
  () => ({
    SightSlider: jest.fn(() => <></>),
  }),
);

import { render } from '@testing-library/react';
import { sights } from '@monkvision/sights';
import { SightOverlay } from '@monkvision/common-ui-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import {
  AddDamageButton,
  PhotoCaptureHUDCounter,
  PhotoCaptureHUDElementsSight,
  PhotoCaptureHUDElementsSightProps,
  SightSlider,
} from '../../../../src';
import { PhotoCaptureMode, TutorialSteps } from '../../../../src/PhotoCapture/hooks';

function createProps(): PhotoCaptureHUDElementsSightProps {
  const captureSights = [
    sights['test-sight-1'],
    sights['test-sight-2'],
    sights['test-sight-3'],
    sights['test-sight-4'],
  ];
  return {
    sights: captureSights,
    selectedSight: captureSights[2],
    sightsTaken: [captureSights[0], captureSights[1]],
    onSelectedSight: jest.fn(),
    onAddDamage: jest.fn(),
    previewDimensions: { width: 4563, height: 992 },
    images: [
      { sightId: 'test-sight-1', status: ImageStatus.NOT_COMPLIANT },
      { sightId: 'test-sight-2', status: ImageStatus.SUCCESS },
    ] as Image[],
    tutorialStep: null,
  };
}

describe('PhotoCaptureHUDElementsSight component', () => {
  it('should display the current sight overlay with the proper dimensions', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUDElementsSight {...props} />);

    expectPropsOnChildMock(SightOverlay, {
      sight: props.selectedSight,
    });

    unmount();
  });

  it('should display the PhotoCaptureHUDCounter component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(
      <PhotoCaptureHUDElementsSight {...props} tutorialStep={TutorialSteps.SIGHT} />,
    );

    expectPropsOnChildMock(PhotoCaptureHUDCounter, {
      mode: PhotoCaptureMode.SIGHT,
      totalSights: props.sights.length,
      sightsTaken: props.sightsTaken.length,
    });

    unmount();
  });

  it('should display the AddDamageButton component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUDElementsSight {...props} />);

    expectPropsOnChildMock(AddDamageButton, {
      onAddDamage: props.onAddDamage,
    });

    unmount();
  });

  it('should display the SightSlider component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUDElementsSight {...props} />);

    expectPropsOnChildMock(SightSlider, {
      sights: props.sights,
      selectedSight: props.selectedSight,
      sightsTaken: props.sightsTaken,
      onSelectedSight: props.onSelectedSight,
      images: props.images,
    });

    unmount();
  });
});
