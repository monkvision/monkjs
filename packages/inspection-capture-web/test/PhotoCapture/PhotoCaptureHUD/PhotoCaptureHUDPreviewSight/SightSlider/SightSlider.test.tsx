jest.mock(
  '../../../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/SightSlider/SightSliderButton',
  () => ({
    SightSliderButton: jest.fn(() => <></>),
  }),
);

import { sights } from '@monkvision/sights';
import { render } from '@testing-library/react';
import { useMonkState, useSightLabel } from '@monkvision/common';
import { ImageStatus, Sight } from '@monkvision/types';
import {
  SightSliderButton,
  SightSliderButtonProps,
  SightSlider,
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
    inspectionId: 'test-inspection-id-test',
    sights: captureSights,
    selectedSight: captureSights[2],
    sightsTaken: [captureSights[0], captureSights[1]],
    onSelectedSight: jest.fn(),
  };
}

describe('SightSlider component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a Button for each sight with the proper props', () => {
    const state = {
      images: [
        {
          inspectionId: createProps().inspectionId,
          additionalData: { sight_id: 'test-sight-1' },
          status: ImageStatus.SUCCESS,
        },
        {
          inspectionId: createProps().inspectionId,
          additionalData: { sight_id: 'test-sight-4' },
          status: ImageStatus.COMPLIANCE_RUNNING,
        },
        {
          inspectionId: createProps().inspectionId,
          additionalData: { sight_id: 'test-sight-5' },
          status: ImageStatus.NOT_COMPLIANT,
        },
      ],
    };
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));
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
        state.images.find(
          (image) =>
            image.inspectionId === props.inspectionId &&
            image.additionalData?.sight_id === sight.id,
        )?.status,
      );
      expect(typeof buttonProps.onClick).toBe('function');
      buttonProps.onClick?.();
      expect(props.onSelectedSight).toHaveBeenCalledWith(sight);
    });

    unmount();
    (useSightLabel as jest.Mock).mockClear();
  });
});
