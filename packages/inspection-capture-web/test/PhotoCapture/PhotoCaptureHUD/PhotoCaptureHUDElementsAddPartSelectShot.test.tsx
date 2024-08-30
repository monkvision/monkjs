import { getLanguage, MonkAppState, useMonkAppState } from '@monkvision/common';
import { Button, VehiclePartSelection } from '@monkvision/common-ui-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { VehiclePart, VehicleType } from '@monkvision/types';
import { act, fireEvent, prettyDOM, render } from '@testing-library/react';
import { PhotoCaptureHUDElementsAddPartSelectShot } from '../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDElementsAddPartSelectShot';
import '@testing-library/jest-dom';

describe('PhotoCaptureHUDElementsAddPartSelectShot component', () => {
  beforeEach(() => {
    (useMonkAppState as jest.MockedFunction<typeof useMonkAppState>).mockReturnValue({
      vehicleType: VehicleType.CUV,
    } as ReturnType<MonkAppState extends (o: { requireInspection: true }) => infer R ? (args: any) => R : never>);
  });
  afterEach(() => jest.clearAllMocks());

  it('should call onCancel callback on close button click', () => {
    const onCancel = jest.fn();
    (Button as jest.MockedFunction<typeof Button>).mockImplementation(({ onClick }) => (
      <button onClick={onClick} data-testid='close-button' />
    ));
    const { getByTestId } = render(
      <PhotoCaptureHUDElementsAddPartSelectShot
        onCancel={onCancel}
        onAddDamageParts={() => {}}
        partSelectState='part-select'
      />,
    );
    fireEvent.click(getByTestId('close-button'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('should use correct vehicle type', () => {
    render(
      <PhotoCaptureHUDElementsAddPartSelectShot
        onCancel={() => {}}
        onAddDamageParts={() => {}}
        partSelectState='part-select'
      />,
    );
    expectPropsOnChildMock(VehiclePartSelection, {
      vehicleType: VehicleType.CUV,
    });
  });

  it('should show instruction to select parts', () => {
    const re = render(
      <PhotoCaptureHUDElementsAddPartSelectShot
        onCancel={jest.fn()}
        onAddDamageParts={() => {}}
        partSelectState='part-select'
      />,
    );
    expect(re.getByText('Please select the parts you want to capture')).toBeInTheDocument();
  });

  it('should show selected parts', () => {
    const re = render(
      <PhotoCaptureHUDElementsAddPartSelectShot
        onCancel={() => {}}
        onAddDamageParts={() => {}}
        partSelectState='part-select'
      />,
    );
    const onPartsSelected = (
      VehiclePartSelection as jest.MockedFunction<typeof VehiclePartSelection>
    ).mock.calls[0][0].onPartsSelected!;
    (getLanguage as jest.MockedFunction<typeof getLanguage>).mockReturnValue('en');
    act(() => onPartsSelected([VehiclePart.BUMPER_BACK]));
    console.log(prettyDOM(re.container));
    expect(re.getByTestId('part-select-notification')).toBeInTheDocument();
  });

  it('should return null on image-capture', () => {
    const { container } = render(
      <PhotoCaptureHUDElementsAddPartSelectShot
        onCancel={() => {}}
        onAddDamageParts={() => {}}
        partSelectState='image-capture'
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('should callback the updated selectedParts to onAddDamageParts', () => {
    const onAddDamageParts = jest.fn();
    render(
      <PhotoCaptureHUDElementsAddPartSelectShot
        onCancel={() => {}}
        onAddDamageParts={onAddDamageParts}
        partSelectState='part-select'
      />,
    );
    const onPartsSelected = (
      VehiclePartSelection as jest.MockedFunction<typeof VehiclePartSelection>
    ).mock.calls[0][0].onPartsSelected!;
    act(() => onPartsSelected([VehiclePart.BUMPER_BACK]));
    expect(onAddDamageParts).toHaveBeenCalledWith([VehiclePart.BUMPER_BACK]);
  });
});
