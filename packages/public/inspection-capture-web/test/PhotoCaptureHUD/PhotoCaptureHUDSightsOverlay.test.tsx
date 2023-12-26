jest.mock('@monkvision/common-ui-web');
jest.mock('@monkvision/sights', () => ({ sights: { sight1: {}, sight2: {} } }));

import { render } from '@testing-library/react';
import { SightOverlay } from '@monkvision/common-ui-web';
import { sights } from '@monkvision/sights';
import { PhotoCaptureHUDSightOverlay } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/PhotoCaptureHUDSightOverlay/PhotoCaptureHUDSightOverlay';

describe('PhotoCaptureHUDSightsOverlay component', () => {
  it('should render Sights Overlay when sight is provided', () => {
    const { unmount } = render(<PhotoCaptureHUDSightOverlay sight={sights['sight1']} />);
    expect(SightOverlay).toHaveBeenCalled();
    unmount();
  });
});
