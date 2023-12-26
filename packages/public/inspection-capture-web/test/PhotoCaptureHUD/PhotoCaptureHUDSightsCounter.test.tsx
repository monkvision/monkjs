import { render } from '@testing-library/react';
import { PhotoCaptureHUDSightCounter } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/PhotoCaptureHUDSightCounter';

describe('PhotoCaptureHUDSightsCounter component', () => {
  it('render counter properly when sightsTaken and totalSights is provided', () => {
    const totalSights = 10;
    const sightsTaken = 5;

    const { getByText, unmount } = render(
      <PhotoCaptureHUDSightCounter sightsTaken={sightsTaken} totalSights={totalSights} />,
    );
    const expectedText = `${sightsTaken} / ${totalSights}`;
    expect(getByText(expectedText).textContent).toEqual(expectedText);
    unmount();
  });
});
