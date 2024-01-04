jest.mock('react-i18next');
jest.mock('@monkvision/common');
jest.mock('@monkvision/common-ui-web');
jest.mock('../../src/PhotoCapture/PhotoCaptureHUDSightPreview', () => ({
  PhotoCaptureHUDSightPreview: jest.fn(() => <></>),
}));
jest.mock('../../src/PhotoCapture/PhotoCaptureHUDButtons', () => ({
  PhotoCaptureHUDButtons: jest.fn(() => <></>),
}));
jest.mock('../../src/PhotoCapture/hooks', () => ({
  ...jest.requireActual('../../src/PhotoCapture/hooks'),
  useSightState: jest.fn(() => ({ handleSightSelected: jest.fn() })),
}));

import { render } from '@testing-library/react';
import { Sight } from '@monkvision/types';
import { PhotoCaptureHUD } from '../../src/PhotoCapture';
import { PhotoCaptureHUDSightPreview } from '../../src/PhotoCapture/PhotoCaptureHUDSightPreview';
import { PhotoCaptureHUDButtons } from '../../src/PhotoCapture/PhotoCaptureHUDButtons';

const sights = [
  { id: 'id', label: { en: 'en', fr: 'fr', de: 'de' } },
  { id: 'id2', label: { en: 'en2', fr: 'fr2', de: 'de2' } },
] as unknown as Sight[];

describe('PhotoCaptureHUD component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render PhotoCaptureHUDSightPreview and PhotoCaptureHUDButtons by default', () => {
    const { unmount } = render(<PhotoCaptureHUD sights={sights} cameraPreview={<></>} />);

    expect(PhotoCaptureHUDSightPreview).toHaveBeenCalled();
    expect(PhotoCaptureHUDButtons).toHaveBeenCalled();
    unmount();
  });

  it('should render PhotoCaptureHUDButtons component', () => {
    const { unmount } = render(<PhotoCaptureHUD sights={sights} cameraPreview={<></>} />);

    expect(PhotoCaptureHUDButtons).toHaveBeenCalledTimes(1);
    unmount();
  });
});
