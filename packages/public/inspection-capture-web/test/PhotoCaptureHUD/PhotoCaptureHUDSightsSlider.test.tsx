jest.mock('react-i18next');
jest.mock('@monkvision/common-ui-web');
jest.mock('@monkvision/common');

import { render } from '@testing-library/react';
import { Button } from '@monkvision/common-ui-web';
import { sights } from '@monkvision/sights/';
import { PhotoCaptureHUDSightsSlider } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/components/PhotoCaptureHUDSightsSlider';

const sightArray = Object.values(sights)
  .map((sight) => sight)
  .slice(0, 19);

describe('PhotoCaptureHUDSightsSlider component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  // const button = Button as unknown as jest.Mock;
  it('should not render any buttons when sights is not provided', () => {
    const { unmount } = render(<PhotoCaptureHUDSightsSlider />);

    expect(Button).toHaveBeenCalledTimes(0);
    unmount();
  });

  it('should render a slider of buttons when sights is provided', () => {
    const { unmount } = render(<PhotoCaptureHUDSightsSlider sights={sightArray} />);

    expect(Button).toHaveBeenCalledTimes(sightArray.length);
    unmount();
  });

  it('should call tObj function for every button', () => {
    const onSightSelected = jest.fn();
    const { unmount } = render(
      <PhotoCaptureHUDSightsSlider
        currentSight={sightArray[0]}
        sights={sightArray}
        onSightSelected={onSightSelected}
      />,
    );
    unmount();
  });
});
