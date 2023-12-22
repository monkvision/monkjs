jest.mock('react-i18next');
jest.mock('@monkvision/common-ui-web');
jest.mock('@monkvision/common');

import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import { useSightLabel } from '@monkvision/common';
import { Sight } from '@monkvision/types';
import { PhotoCaptureHUDSightsSlider } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDPreviewSight/components/PhotoCaptureHUDSightsSlider';

const sights = [
  { id: 'id', label: { en: 'en', fr: 'fr', de: 'de' } },
  { id: 'id2', label: { en: 'en2', fr: 'fr2', de: 'de2' } },
] as unknown as Sight[];

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

  it('should get passed onSightSelected callback', () => {
    const buttonMock = Button as unknown as jest.Mock;
    const onSightSelected = jest.fn();
    const { unmount } = render(
      <PhotoCaptureHUDSightsSlider
        currentSight={sights[0].id}
        sights={sights}
        onSightSelected={onSightSelected}
      />,
    );

    expect(buttonMock).toHaveBeenCalledTimes(sights.length);
    sights.forEach((sight, index) => {
      expectPropsOnChildMock(buttonMock, { onClick: expect.any(Function) });
      const onClickProp = buttonMock.mock.calls[index][0].onClick;
      onClickProp();
      expect(onSightSelected).toHaveBeenCalledWith(sight);
    });

    unmount();
  });

  describe('Sight Button', () => {
    it('should have primary-base as primary color if button selected', () => {
      const buttonMock = Button as unknown as jest.Mock;
      const { unmount } = render(
        <PhotoCaptureHUDSightsSlider currentSight={sights[0].id} sights={sights} />,
      );
      sights.forEach((sight, index) => {
        expectPropsOnChildMock(buttonMock, { primaryColor: expect.any(String) });
        const primaryColorProp = buttonMock.mock.calls[index][0].primaryColor;

        const baseColor = 'primary-base';
        const secondColor = 'secondary-xdark';
        expect(primaryColorProp).toEqual(sight.id === sights[0].id ? baseColor : secondColor);
      });

      unmount();
    });

    it('should call label function to translate the sight label', () => {
      const useSightLabelMock = useSightLabel as jest.Mock;
      const { unmount } = render(
        <PhotoCaptureHUDSightsSlider currentSight={sights[0].id} sights={sights} />,
      );
      const { label } = useSightLabelMock.mock.results[0].value;
      sights.forEach(() => {
        expect(label).toHaveBeenCalled();
      });
      expect(label).toHaveBeenCalledTimes(sights.length);

      unmount();
    });
  });
});
