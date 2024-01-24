jest.mock('@monkvision/common');
jest.mock('../../src/components/InspectionGallery/hooks', () => ({
  useInspectionGallery: jest.fn(() => ({ content: {}, label: {} })),
}));

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import * as common from '@monkvision/common';
import { MonkEntityType, ImageType } from '@monkvision/types';
import { useInspectionGallery } from '../../src/components/InspectionGallery/hooks';
import { InspectionGallery } from '../../src';

describe('InspectionGallery component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call 3 customs hooks: useMonkState, useObjectTranslation, useInspectionGallery', () => {
    const { unmount } = render(<InspectionGallery inspectionID={'test'} />);

    expect(common.useMonkState).toHaveBeenCalled();
    expect(common.useObjectTranslation).toHaveBeenCalled();
    expect(useInspectionGallery).toHaveBeenCalled();

    unmount();
  });

  it('should display a text when inspection is not found in Monk State', () => {
    const { unmount } = render(<InspectionGallery inspectionID={'test'} />);

    expect(screen.getByTestId('no-picture').textContent).toEqual(
      'There are no pictures in the inspection yet.',
    );

    unmount();
  });

  it('should render the correct label when inpection ID is found in the Monk state', () => {
    jest.spyOn(common, 'useMonkState').mockImplementationOnce(() => ({
      state: {
        inspections: [
          {
            entityType: MonkEntityType.INSPECTION,
            id: 'inspection-id',
            images: ['image'],
            damages: ['damage'],
            parts: ['part'],
            tasks: ['tasks'],
          },
        ],
        images: [
          {
            entityType: MonkEntityType.IMAGE,
            width: 10,
            height: 10,
            size: 10,
            mimetype: 'mimetype',
            renderedOutputs: ['renderedOutputs'],
            views: ['view'],
            id: 'image-id',
            inspectionId: 'inspection-id',
            type: ImageType.BEAUTY_SHOT,
            path: 'path-to-image',
          },
        ],
        damages: [],
        parts: [],
        views: [],
        renderedOutputs: [],
        tasks: [],
        partOperations: [],
        severityResults: [],
        vehicles: [],
      },
      dispatch: () => {},
    }));

    const { unmount } = render(<InspectionGallery inspectionID={'inspection-id'} />);

    expect(screen.getByTestId('label-0').textContent).toEqual('no label');
    expect(screen.getByTestId('img-0')).toHaveAttribute('src', 'path-to-image');

    unmount();
  });
});
