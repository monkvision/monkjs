jest.mock('@monkvision/common-ui-web');

import { PhotoCaptureHUDSightsOverlay } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDPreview/PhotoCaptureHUDSightsOverlay';
import { render, screen } from '@testing-library/react';
import { SightOverlay } from '@monkvision/common-ui-web';
import { sights } from '@monkvision/sights/lib/data';

const sightArray = Object.values(sights).map((sight) => sight);

describe('PhotoCaptureHUDSightsOverlay component', () => {
  // it('does not render Sights Overlay when sight is not provided', () => {
  //   const sightOverlayMock = SightOverlay as unknown as jest.Mock;
  //   const { unmount } = render(<PhotoCaptureHUDSightsOverlay />);
  //   unmount();
  // });

  it('renders Sights Overlay when sight is provided', () => {
    const { unmount } = render(<PhotoCaptureHUDSightsOverlay sight={sightArray[0]} />);
    expect(SightOverlay).toHaveBeenCalled();
    unmount();
  });
});
