import { PartSelectionOrientation, VehicleModel, VehicleType } from '@monkvision/types';
import { VehicleDynamicWireframe } from '../../src/components/VehicleDynamicWireframe';
import * as dynamicSVGModule from '../../src/components/DynamicSVG';
import { fireEvent, render } from '@testing-library/react';
import { expectLastPropsOnChildMock } from '@monkvision/test-utils';
import { partSelectionWireframes } from '@monkvision/sights';

jest.mock('../../src/components/DynamicSVG');

describe('VehicleDynamicWireframe component', () => {
  let dynamicSVGModuleMock: jest.MockedObjectDeep<typeof dynamicSVGModule>;
  beforeEach(() => {
    dynamicSVGModuleMock = jest.mocked(dynamicSVGModule, true);
    dynamicSVGModuleMock.DynamicSVG.mockImplementation(() => <></>);
  });
  afterEach(() => jest.clearAllMocks());

  it('should not throw error if wireframe found', () => {
    render(<VehicleDynamicWireframe vehicleType={VehicleType.CUV} />);
    expect(dynamicSVGModuleMock.DynamicSVG).toHaveBeenCalledTimes(1);
  });

  it('should throw error if wireframe not found', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<VehicleDynamicWireframe vehicleType={VehicleType.PICKUP} />)).toThrowError(
      `No wireframe found for vehicle type ${VehicleType.PICKUP}`,
    );
  });

  it('should update the overlay while changing the orientation', () => {
    const { rerender } = render(<VehicleDynamicWireframe vehicleType={VehicleType.CUV} />);
    expect(dynamicSVGModuleMock.DynamicSVG).toHaveBeenCalledTimes(1);
    expectLastPropsOnChildMock(dynamicSVGModuleMock.DynamicSVG, {
      svg: partSelectionWireframes[VehicleModel.FESC20]?.[PartSelectionOrientation.FRONT_LEFT],
    });
    rerender(
      <VehicleDynamicWireframe
        vehicleType={VehicleType.CUV}
        orientation={PartSelectionOrientation.REAR_LEFT}
      />,
    );
    expect(dynamicSVGModuleMock.DynamicSVG).toHaveBeenCalledTimes(2);
    expectLastPropsOnChildMock(dynamicSVGModuleMock.DynamicSVG, {
      svg: partSelectionWireframes[VehicleModel.FESC20]?.[PartSelectionOrientation.REAR_LEFT],
    });
  });

  it('should trigger onClickPart when part is clicked', () => {
    dynamicSVGModuleMock.DynamicSVG.mockImplementation(({ getAttributes }) => {
      const groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      groupElement.classList.add('car-part', 'selectable');
      groupElement.setAttribute('id', 'vehicle-part');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const attributes = getAttributes!(groupElement, []);
      return <svg onClick={attributes.onClick}></svg>;
    });
    const mockFn = jest.fn();
    render(<VehicleDynamicWireframe vehicleType={VehicleType.CUV} onClickPart={mockFn} />);
    fireEvent.click(document.querySelector('svg') as Element);
    expect(mockFn).toBeCalled();
  });

  it('should get value from getPartAttributes', () => {
    const getPartAttributes = jest.fn(() => ({
      style: {
        fill: 'red',
      },
    }));
    dynamicSVGModuleMock.DynamicSVG.mockImplementation(({ getAttributes }) => {
      const groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      groupElement.classList.add('car-part');
      groupElement.setAttribute('id', 'vehicle-part');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const attributes = getAttributes!(groupElement, []);
      return <svg style={attributes.style}></svg>;
    });
    render(
      <VehicleDynamicWireframe
        vehicleType={VehicleType.CUV}
        getPartAttributes={getPartAttributes}
      />,
    );
    expect(getPartAttributes).toBeCalled();
    expect(document.querySelector('svg')?.getAttribute('style')).toBe('fill: red;');
  });

  it('should get value from getPartAttributes, selectable to have correct onClick', () => {
    const getPartAttributes = jest.fn(() => ({
      style: {
        fill: 'red',
      },
    }));
    dynamicSVGModuleMock.DynamicSVG.mockImplementation(({ getAttributes }) => {
      const groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      groupElement.classList.add('car-part', 'selectable');
      groupElement.setAttribute('id', 'vehicle-part');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const attributes = getAttributes!(groupElement, []);
      return <svg style={attributes.style}></svg>;
    });
    render(
      <VehicleDynamicWireframe
        vehicleType={VehicleType.CUV}
        getPartAttributes={getPartAttributes}
      />,
    );
    expect(getPartAttributes).toBeCalled();
    expect(document.querySelector('svg')?.getAttribute('style')).toBe(
      'fill: red; pointer-events: fill; cursor: pointer;',
    );
  });
});
