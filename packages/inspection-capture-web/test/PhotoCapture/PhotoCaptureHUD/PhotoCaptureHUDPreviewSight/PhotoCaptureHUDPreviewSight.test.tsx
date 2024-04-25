jest.mock('../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDCounter', () => ({
  PhotoCaptureHUDCounter: jest.fn(() => <></>),
}));
jest.mock(
  '../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/AddDamageButton',
  () => ({
    AddDamageButton: jest.fn(() => <></>),
  }),
);
jest.mock(
  '../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/SightSlider',
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
  PhotoCaptureHUDPreviewSight,
  PhotoCaptureHUDSightPreviewProps,
  SightSlider,
} from '../../../../src';
import { PhotoCaptureMode } from '../../../../src/PhotoCapture/hooks';

function createProps(): PhotoCaptureHUDSightPreviewProps {
  const captureSights = [
    sights['test-sight-1'],
    sights['test-sight-2'],
    sights['test-sight-3'],
    sights['test-sight-4'],
  ];
  return {
    inspectionId: 'inspection-id-test',
    sights: captureSights,
    selectedSight: captureSights[2],
    sightsTaken: [captureSights[0], captureSights[1]],
    onSelectedSight: jest.fn(),
    onAddDamage: jest.fn(),
    streamDimensions: { width: 4563, height: 992 },
  };
}

describe('PhotoCaptureHUDPreviewSight component', () => {
  it('should display the current sight overlay with the proper aspect ratio', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUDPreviewSight {...props} />);

    expectPropsOnChildMock(SightOverlay, {
      sight: props.selectedSight,
      style: expect.objectContaining({
        aspectRatio: `${props.streamDimensions?.width}/${props.streamDimensions?.height}`,
      }),
    });

    unmount();
  });

  it('should display the PhotoCaptureHUDCounter component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUDPreviewSight {...props} />);

    expectPropsOnChildMock(PhotoCaptureHUDCounter, {
      mode: PhotoCaptureMode.SIGHT,
      totalSights: props.sights.length,
      sightsTaken: props.sightsTaken.length,
    });

    unmount();
  });

  it('should display the AddDamageButton component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUDPreviewSight {...props} />);

    expectPropsOnChildMock(AddDamageButton, {
      onAddDamage: props.onAddDamage,
    });

    unmount();
  });

  it('should display the SightSlider component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUDPreviewSight {...props} />);

    expectPropsOnChildMock(SightSlider, {
      inspectionId: props.inspectionId,
      sights: props.sights,
      selectedSight: props.selectedSight,
      sightsTaken: props.sightsTaken,
      onSelectedSight: props.onSelectedSight,
    });

    unmount();
  });
});
