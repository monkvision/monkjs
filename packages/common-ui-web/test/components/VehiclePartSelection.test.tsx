import { PartSelectionOrientation, VehiclePart, VehicleType } from '@monkvision/types';
import * as vehicleDynamicWireframeModule from '../../src/components/VehicleDynamicWireframe';
import * as iconsModule from '../../src/icons';
import { VehiclePartSelection } from '../../src/components/VehiclePartSelection';
import { fireEvent, render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';

jest.mock('../../src/components/VehicleDynamicWireframe');
jest.mock('../../src/icons');

describe('VehiclePartSelection component', () => {
  let vehicleDynamicWireframeModuleMock: jest.MockedObjectDeep<
    typeof vehicleDynamicWireframeModule
  >;
  let iconsModuleMock: jest.MockedObjectDeep<typeof iconsModule>;

  let selectedParts = VehiclePart.BUMPER_BACK;
  beforeEach(() => {
    vehicleDynamicWireframeModuleMock = jest.mocked(vehicleDynamicWireframeModule, true);
    iconsModuleMock = jest.mocked(iconsModule, true);
    vehicleDynamicWireframeModuleMock.VehicleDynamicWireframe.mockImplementation(
      ({ onClickPart }) => (
        <button
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          onClick={() => onClickPart!(selectedParts)}
          data-testid='VehicleDynamicWireframe'
        ></button>
      ),
    );
    iconsModuleMock.Icon.mockImplementation(({ icon, onClick }) => (
      <svg data-testid={icon} onClick={onClick}></svg>
    ));
  });
  afterEach(() => jest.clearAllMocks());
  it('should emit when parts are selected from one', () => {
    const mockPartSelect = jest.fn();
    render(
      <VehiclePartSelection vehicleType={VehicleType.HATCHBACK} onPartsSelected={mockPartSelect} />,
    );
    fireEvent.click(screen.getByTestId('VehicleDynamicWireframe'));
    expect(mockPartSelect).toBeCalledWith([VehiclePart.BUMPER_BACK]);
  });
  it('should change orientation when Icons are clicked', () => {
    render(<VehiclePartSelection vehicleType={VehicleType.HATCHBACK} />);
    expectPropsOnChildMock(vehicleDynamicWireframeModuleMock.VehicleDynamicWireframe, {
      orientation: PartSelectionOrientation.FRONT_LEFT,
    });
    fireEvent.click(screen.getByTestId('rotate-left'));
    expectPropsOnChildMock(vehicleDynamicWireframeModuleMock.VehicleDynamicWireframe, {
      orientation: PartSelectionOrientation.REAR_LEFT,
    });
    fireEvent.click(screen.getByTestId('rotate-right'));
    fireEvent.click(screen.getByTestId('rotate-right'));
    expectPropsOnChildMock(vehicleDynamicWireframeModuleMock.VehicleDynamicWireframe, {
      orientation: PartSelectionOrientation.FRONT_RIGHT,
    });
  });
  it('should emit when parts are selected from multiple orientation', () => {
    const mockPartSelect = jest.fn();
    render(
      <VehiclePartSelection
        vehicleType={VehicleType.HATCHBACK}
        onPartsSelected={mockPartSelect}
        orientation={PartSelectionOrientation.FRONT_LEFT}
      />,
    );
    fireEvent.click(screen.getByTestId('VehicleDynamicWireframe'));
    selectedParts = VehiclePart.BUMPER_FRONT;
    fireEvent.click(screen.getByTestId('rotate-left'));
    fireEvent.click(screen.getByTestId('VehicleDynamicWireframe'));
    expect(mockPartSelect).toHaveBeenLastCalledWith([
      VehiclePart.BUMPER_BACK,
      VehiclePart.BUMPER_FRONT,
    ]);
  });
});
