jest.mock('@monkvision/common-ui-web');
jest.mock('@monkvision/sights', () => ({ sights: { sight1: {}, sight2: {} } }));

import { render } from '@testing-library/react';
import { SightOverlay } from '@monkvision/common-ui-web';
import { sights } from '@monkvision/sights';
import { PhotoCaptureHUDSightsOverlay } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/components/PhotoCaptureHUDSightsOverlay';

describe('PhotoCaptureHUDSightsOverlay component', () => {
  it('should render not Sights Overlay when sight is not provided', () => {
    const { unmount } = render(<PhotoCaptureHUDSightsOverlay />);
    expect(SightOverlay).toHaveBeenCalledTimes(0);
    unmount();
  });

  it('should render Sights Overlay when sight is provided', () => {
    const { unmount } = render(<PhotoCaptureHUDSightsOverlay sight={sights['sight1']} />);
    expect(SightOverlay).toHaveBeenCalled();
    unmount();
  });
});
