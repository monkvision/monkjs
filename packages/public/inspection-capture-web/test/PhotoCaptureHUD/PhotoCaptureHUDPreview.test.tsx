import { render } from '@testing-library/react';
import { PhotoCaptureHUDPreview } from '../../src';

describe('PhotoCaptureHUDPreview component', () => {
  it('render HUDPreview with no props', () => {
    const { unmount } = render(<PhotoCaptureHUDPreview />);
    unmount();
  });
});
