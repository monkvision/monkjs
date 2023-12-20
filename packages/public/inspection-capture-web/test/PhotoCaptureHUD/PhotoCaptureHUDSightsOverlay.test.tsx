jest.mock('@monkvision/common-ui-web');

import { PhotoCaptureHUDSightsOverlay } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/components/PhotoCaptureHUDSightsOverlay';
import { render } from '@testing-library/react';
import { SightOverlay } from '@monkvision/common-ui-web';
import { sights } from '@monkvision/sights/lib/data';

const sightArray = Object.values(sights).map((sight) => sight);

describe('PhotoCaptureHUDSightsOverlay component', () => {
  it('renders Sights Overlay when sight is provided', () => {
    const { unmount } = render(<PhotoCaptureHUDSightsOverlay sight={sightArray[0]} />);
    expect(SightOverlay).toHaveBeenCalled();
    unmount();
  });
});
