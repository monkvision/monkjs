import { render } from '@testing-library/react';
import { PhotoCaptureHUDCounter } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/components/PhotoCaptureHUDSightsCounter';

describe('PhotoCaptureHUDSightsCounter component', () => {
  it('render counter with no props', () => {
    const { getByText, unmount } = render(<PhotoCaptureHUDCounter />);
    const expectedText = 'error-no-sight';
    expect(getByText(expectedText).textContent).toEqual(expectedText);
    unmount();
  });
  it('render counter with props', () => {
    const totalSights = 10;
    const sightsTaken = 5;

    const { getByText, unmount } = render(
      <PhotoCaptureHUDCounter sightsTaken={sightsTaken} totalSights={totalSights} />,
    );
    const expectedText = `${sightsTaken} / ${totalSights}`;
    expect(getByText(expectedText).textContent).toEqual(expectedText);
    unmount();
  });
});
