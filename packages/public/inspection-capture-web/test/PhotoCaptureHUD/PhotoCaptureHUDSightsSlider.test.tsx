jest.mock('react-i18next');
jest.mock('@monkvision/common-ui-web');
jest.mock('@monkvision/common');

// import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render } from '@testing-library/react';
import { Button } from '@monkvision/common-ui-web';
import { PhotoCaptureHUDSightsSlider } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/components/PhotoCaptureHUDSightsSlider';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Sight } from '@monkvision/types';

const sights = [{ id: 'id', label: { en: 'en', fr: 'fr', de: 'de' } }] as unknown as Sight[];

describe('PhotoCaptureHUDSightsSlider component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render any buttons when sights is not provided', () => {
    const { unmount } = render(<PhotoCaptureHUDSightsSlider />);

    expect(Button).toHaveBeenCalledTimes(0);
    unmount();
  });

  it('should render a slider of buttons when sights is provided', () => {
    const { unmount } = render(<PhotoCaptureHUDSightsSlider sights={sights} />);

    expect(Button).toHaveBeenCalledTimes(sights.length);
    unmount();
  });

  it('should call tObj function for every button', () => {
    const buttonMock = Button as unknown as jest.Mock;
    const onSightSelected = jest.fn();
    const { unmount } = render(
      <PhotoCaptureHUDSightsSlider
        currentSight={sights[0].id}
        sights={sights}
        onSightSelected={onSightSelected}
      />,
    );

    expect(buttonMock).toHaveBeenCalledTimes(1);
    expectPropsOnChildMock(buttonMock, { onClick: expect.any(Function) });
    const onClickProp = buttonMock.mock.calls[0][0].onClick;
    const myValue = { test: 'salut' };
    onClickProp(myValue);
    expect(onSightSelected).toHaveBeenCalledWith(sights[0]);

    unmount();
  });
});
