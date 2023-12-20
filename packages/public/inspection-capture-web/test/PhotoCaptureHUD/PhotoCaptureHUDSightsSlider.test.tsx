jest.mock('react-i18next');
jest.mock('@monkvision/common-ui-web');
jest.mock('@monkvision/common');
jest.mock('@monkvision/sights');

// import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render } from '@testing-library/react';
import { sights } from '@monkvision/sights';
import { Button } from '@monkvision/common-ui-web';
import { PhotoCaptureHUDSightsSlider } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/components/PhotoCaptureHUDSightsSlider';

const sightArray = Object.values(sights);

describe('PhotoCaptureHUDSightsSlider component', () => {
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

  // it('should call tObj function for every button', () => {
  //   const buttonMock = Button as unknown as jest.Mock;
  //   const onSightSelected = jest.fn();
  //   const { unmount } = render(
  //     <PhotoCaptureHUDSightsSlider
  //       currentSight={sightArray[0]}
  //       sights={sightArray}
  //       onSightSelected={onSightSelected}
  //     />,
  //   );
  //   expectPropsOnChildMock(buttonMock, { onClick: expect.any(Function) });
  //
  //   unmount();
  // });
});
