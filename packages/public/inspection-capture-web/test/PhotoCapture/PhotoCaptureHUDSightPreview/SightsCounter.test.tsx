import { render } from '@testing-library/react';
import { SightsCounter } from '../../../src/PhotoCapture/PhotoCaptureHUDSightPreview/SightsCounter';

describe('SightsCounter component', () => {
  it('render counter properly when sightsTaken and totalSights is provided', () => {
    const totalSights = 10;
    const sightsTaken = 5;

    const { getByText, unmount } = render(
      <SightsCounter sightsTaken={sightsTaken} totalSights={totalSights} />,
    );
    const expectedText = `${sightsTaken} / ${totalSights}`;
    expect(getByText(expectedText).textContent).toEqual(expectedText);
    unmount();
  });
});
