jest.mock('react-i18next');
jest.mock('@monkvision/common-ui-web');
jest.mock('@monkvision/common');

import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import { useSightLabel } from '@monkvision/common';
import { Sight } from '@monkvision/types';
import { SightsSlider } from '../../../src/PhotoCaptureHUD/PhotoCaptureHUDSightPreview/SightsSlider';

const sights = [
  { id: 'id', label: { en: 'en', fr: 'fr', de: 'de' } },
  { id: 'id2', label: { en: 'en2', fr: 'fr2', de: 'de2' } },
] as unknown as Sight[];
const sightsTaken = [...sights].slice(0, 1);

describe('SightsSlider component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a slider of buttons when sights is provided', () => {
    const { unmount } = render(
      <SightsSlider sights={sights} selectedSight={sights[0]} sightsTaken={sightsTaken} />,
    );

    expect(Button).toHaveBeenCalledTimes(sights.length);
    unmount();
  });

  it('should get passed onSightSelected callback', () => {
    const buttonMock = Button as unknown as jest.Mock;
    const onSightSelected = jest.fn();
    const { unmount } = render(
      <SightsSlider
        selectedSight={sights[0]}
        sights={sights}
        sightsTaken={sightsTaken}
        onSelectedSight={onSightSelected}
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
        <SightsSlider selectedSight={sights[0]} sightsTaken={sightsTaken} sights={sights} />,
      );
      sights.forEach((sight, index) => {
        expectPropsOnChildMock(buttonMock, { primaryColor: expect.any(String) });
        const primaryColorProp = buttonMock.mock.calls[index][0].primaryColor;

        const baseColor = 'primary-base';
        const secondColor = 'secondary-xdark';
        const thirdColor = 'primary-light';

        let expectedColor = secondColor;
        if (sight.id === sights[0].id) {
          expectedColor = baseColor;
        }
        if (sightsTaken?.some((sightTaken) => sightTaken.id === sight.id)) {
          expectedColor = thirdColor;
        }

        expect(primaryColorProp).toEqual(expectedColor);
      });

      unmount();
    });

    it('should call label function to translate the sight label', () => {
      const useSightLabelMock = useSightLabel as jest.Mock;
      const { unmount } = render(
        <SightsSlider selectedSight={sights[0]} sightsTaken={sightsTaken} sights={sights} />,
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
