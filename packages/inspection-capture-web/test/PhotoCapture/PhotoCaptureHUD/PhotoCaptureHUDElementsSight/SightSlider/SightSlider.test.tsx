jest.mock(
  '../../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsSight/SightSlider/SightSliderButton',
  () => ({
    SightSliderButton: jest.fn(() => <></>),
  }),
);

import { sights } from '@monkvision/sights';
import { render } from '@testing-library/react';
import { useSightLabel } from '@monkvision/common';
import { Image, ImageStatus, Sight } from '@monkvision/types';
import {
  SightSlider,
  SightSliderButton,
  SightSliderButtonProps,
  SightSliderProps,
} from '../../../../../src';

function createProps(): SightSliderProps {
  const captureSights = [
    sights['test-sight-1'],
    sights['test-sight-2'],
    sights['test-sight-3'],
    sights['test-sight-4'],
    sights['test-sight-5'],
  ];
  return {
    sights: captureSights,
    selectedSight: captureSights[2],
    sightsTaken: [captureSights[0], captureSights[1]],
    onSelectedSight: jest.fn(),
    onRetakeSight: jest.fn(),
    images: [
      { sightId: 'test-sight-1', status: ImageStatus.NOT_COMPLIANT },
      { sightId: 'test-sight-2', status: ImageStatus.SUCCESS },
    ] as Image[],
  };
}

describe('SightSlider component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a Button for each sight with the proper props', () => {
    (useSightLabel as jest.Mock).mockImplementation(() => ({ label: (sight: Sight) => sight.id }));
    const props = createProps();
    const { unmount } = render(<SightSlider {...props} />);

    expect(SightSliderButton).toHaveBeenCalledTimes(props.sights.length);
    props.sights.forEach((sight) => {
      (props.onSelectedSight as jest.Mock).mockClear();
      const buttonProps = (SightSliderButton as unknown as jest.Mock).mock.calls.find(
        (args) => args[0].label === sight.id,
      )?.[0] as SightSliderButtonProps & { key: string };

      expect(buttonProps).toBeDefined();
      expect(buttonProps.isSelected).toEqual(props.selectedSight === sight);
      expect(buttonProps.status).toEqual(
        props.images.find((image) => image.sightId === sight.id)?.status,
      );
      expect(typeof buttonProps.onClick).toBe('function');
      buttonProps.onClick?.();
      if (
        props.images.find((image) => image.sightId === sight.id)?.status ===
        ImageStatus.NOT_COMPLIANT
      ) {
        return;
      }
      expect(props.onSelectedSight).toHaveBeenCalledWith(sight);
    });

    props.sights.forEach((sight) => {
      (props.onSelectedSight as jest.Mock).mockClear();
      const buttonProps = (SightSliderButton as unknown as jest.Mock).mock.calls.find(
        (args) => args[0].label === sight.id,
      )?.[0] as SightSliderButtonProps & { key: string };

      expect(buttonProps).toBeDefined();
      expect(buttonProps.isSelected).toEqual(props.selectedSight === sight);
      expect(buttonProps.status).toEqual(
        props.images.find((image) => image.sightId === sight.id)?.status,
      );
      expect(typeof buttonProps.onClick).toBe('function');
      buttonProps.onClick?.();
      if (
        props.images.find((image) => image.sightId === sight.id)?.status !==
        ImageStatus.NOT_COMPLIANT
      ) {
        return;
      }
      expect(props.onRetakeSight).toHaveBeenCalledWith(sight.id);
    });

    unmount();
    (useSightLabel as jest.Mock).mockClear();
  });
});
