jest.mock(
  '../../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/SightsSlider/SightSliderButton',
  () => ({
    SightSliderButton: jest.fn(() => <></>),
  }),
);

import { sights } from '@monkvision/sights';
import { render } from '@testing-library/react';
import { useSightLabel } from '@monkvision/common';
import { Sight } from '@monkvision/types';
import {
  SightSliderButton,
  SightSliderButtonProps,
  SightsSlider,
  SightsSliderProps,
} from '../../../../../src';

function createProps(): SightsSliderProps {
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
  };
}

describe('SightsSlider component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a Button for each sight with the proper props', () => {
    (useSightLabel as jest.Mock).mockImplementation(() => ({ label: (sight: Sight) => sight.id }));
    const props = createProps();
    const { unmount } = render(<SightsSlider {...props} />);

    expect(SightSliderButton).toHaveBeenCalledTimes(props.sights.length);
    props.sights.forEach((sight) => {
      (props.onSelectedSight as jest.Mock).mockClear();
      const buttonProps = (SightSliderButton as unknown as jest.Mock).mock.calls.find(
        (args) => args[0].label === sight.id,
      )?.[0] as SightSliderButtonProps & { key: string };

      expect(buttonProps).toBeDefined();
      expect(buttonProps.isSelected).toEqual(props.selectedSight === sight);
      expect(buttonProps.isTaken).toEqual(props.sightsTaken.includes(sight));
      expect(typeof buttonProps.onClick).toBe('function');
      buttonProps.onClick?.();
      expect(props.onSelectedSight).toHaveBeenCalledWith(sight);
    });

    unmount();
    (useSightLabel as jest.Mock).mockClear();
  });
});
