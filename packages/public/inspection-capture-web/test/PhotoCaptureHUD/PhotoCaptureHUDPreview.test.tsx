jest.mock('@monkvision/sights');

import { render } from '@testing-library/react';
import { PhotoCaptureHUDPreview } from '../../src';

describe('PhotoCaptureHUDPreview component', () => {
  it('render HUDPreview with no props', () => {
    // TODO: how can I test this?
    const { unmount } = render(<PhotoCaptureHUDPreview />);
    unmount();
  });
});
