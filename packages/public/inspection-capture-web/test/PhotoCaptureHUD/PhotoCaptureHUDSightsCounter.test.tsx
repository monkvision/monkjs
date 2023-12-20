import { render } from '@testing-library/react';
import { PhotoCaptureHUDCounter } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/components/PhotoCaptureHUDSightsCounter';

describe('PhotoCaptureHUDSightsCounter component', () => {
  it('should render a error message when sightsTaken and totalSights is not provided', () => {
    const { getByText, unmount } = render(<PhotoCaptureHUDCounter />);
    const expectedText = 'error-no-sight';
    expect(typeof getByText(expectedText).textContent).toEqual('string');
    unmount();
  });

  it('should render a error message when only totalSights is provided', () => {
    const totalSights = 10;
    const { getByText, unmount } = render(<PhotoCaptureHUDCounter totalSights={totalSights} />);
    const expectedText = `0 / ${totalSights}`;
    expect(getByText(expectedText).textContent).toEqual(expectedText);
    unmount();
  });

  it('should render a error message when only sightsTaken is provided', () => {
    const sightsTaken = 5;
    const { getByText, unmount } = render(<PhotoCaptureHUDCounter sightsTaken={sightsTaken} />);
    const expectedText = 'error-no-sight';
    expect(getByText(expectedText).textContent).toEqual(expectedText);
    unmount();
  });

  it('render counter properly when sightsTaken and totalSights is provided', () => {
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
