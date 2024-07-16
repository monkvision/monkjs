import { PartSelectionOrientation, VehicleModel } from '@monkvision/types';
import { VehicleDynamicWireframe } from '../../../src/components/VehicleDynamicWireframe';
import * as dynamicSVGModule from '../../../src/components/DynamicSVG';
import { render } from '@testing-library/react';
import { expectPropsOnChildMockStrict } from '@monkvision/test-utils';
import { wireFrame } from '@monkvision/sights';

jest.mock('../../../src/components/DynamicSVG');

describe('VehicleDynamicWireframe component', () => {
  let dynamicSVGModuleMock: jest.MockedObjectDeep<typeof dynamicSVGModule>;
  beforeEach(() => {
    dynamicSVGModuleMock = jest.mocked(dynamicSVGModule, true);
    dynamicSVGModuleMock.DynamicSVG.mockImplementation(() => <></>);
  });
  afterEach(() => jest.clearAllMocks());
  it('should not throw error if wireframe found', () => {
    render(<VehicleDynamicWireframe vehicleModel={VehicleModel.FESC20} parts={[]} />);
    expect(dynamicSVGModuleMock.DynamicSVG).toHaveBeenCalledTimes(1);
  });

  it('should throw error if wireframe not found', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<VehicleDynamicWireframe vehicleModel={VehicleModel.ALL} parts={[]} />),
    ).toThrow();
    expect(() =>
      render(<VehicleDynamicWireframe vehicleModel={VehicleModel.ALL} parts={[]} />),
    ).toThrowError(`No wireframe found for vehicle type ${VehicleModel.ALL}`);
  });

  it('should update the overlay while changing the orientation', () => {
    const { rerender } = render(
      <VehicleDynamicWireframe vehicleModel={VehicleModel.AUDIA7} parts={[]} />,
    );
    expect(dynamicSVGModuleMock.DynamicSVG).toHaveBeenCalledTimes(1);
    expectPropsOnChildMockStrict(dynamicSVGModuleMock.DynamicSVG, {
      svg: wireFrame[VehicleModel.AUDIA7]?.[PartSelectionOrientation.FRONT_LEFT],
    });
    rerender(
      <VehicleDynamicWireframe
        vehicleModel={VehicleModel.AUDIA7}
        parts={[]}
        orientation={PartSelectionOrientation.REAR_LEFT}
      />,
    );
    expect(dynamicSVGModuleMock.DynamicSVG).toHaveBeenCalledTimes(2);
    expectPropsOnChildMockStrict(dynamicSVGModuleMock.DynamicSVG, {
      svg: wireFrame[VehicleModel.AUDIA7]?.[PartSelectionOrientation.REAR_LEFT],
    });
  });

  it('should call onPartsSelected initially', () => {
    const mockFn = jest.fn();
    const { unmount } = render(
      <VehicleDynamicWireframe
        vehicleModel={VehicleModel.AUDIA7}
        parts={[]}
        onPartsSelected={mockFn}
      />,
    );
    expect(mockFn).toBeCalled();
    unmount();
  });
});
