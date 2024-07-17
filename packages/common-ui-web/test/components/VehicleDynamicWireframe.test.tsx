import { PartSelectionOrientation, VehicleModel } from '@monkvision/types';
import { VehicleDynamicWireframe } from '../../src/components/VehicleDynamicWireframe';
import * as dynamicSVGModule from '../../src/components/DynamicSVG';
import { fireEvent, render } from '@testing-library/react';
import { expectPropsOnChildMockStrict } from '@monkvision/test-utils';
import { wireFrame } from '@monkvision/sights';

jest.mock('../../src/components/DynamicSVG');

describe('VehicleDynamicWireframe component', () => {
  let dynamicSVGModuleMock: jest.MockedObjectDeep<typeof dynamicSVGModule>;
  beforeEach(() => {
    dynamicSVGModuleMock = jest.mocked(dynamicSVGModule, true);
    dynamicSVGModuleMock.DynamicSVG.mockImplementation(() => <></>);
  });
  afterEach(() => jest.clearAllMocks());
  it('should not throw error if wireframe found', () => {
    render(<VehicleDynamicWireframe vehicleModel={VehicleModel.FESC20} />);
    expect(dynamicSVGModuleMock.DynamicSVG).toHaveBeenCalledTimes(1);
  });

  it('should throw error if wireframe not found', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<VehicleDynamicWireframe vehicleModel={VehicleModel.ALL} />)).toThrow();
    expect(() => render(<VehicleDynamicWireframe vehicleModel={VehicleModel.ALL} />)).toThrowError(
      `No wireframe found for vehicle type ${VehicleModel.ALL}`,
    );
  });

  it('should update the overlay while changing the orientation', () => {
    const { rerender } = render(<VehicleDynamicWireframe vehicleModel={VehicleModel.AUDIA7} />);
    expect(dynamicSVGModuleMock.DynamicSVG).toHaveBeenCalledTimes(1);
    expectPropsOnChildMockStrict(dynamicSVGModuleMock.DynamicSVG, {
      svg: wireFrame[VehicleModel.AUDIA7]?.[PartSelectionOrientation.FRONT_LEFT],
    });
    rerender(
      <VehicleDynamicWireframe
        vehicleModel={VehicleModel.AUDIA7}
        orientation={PartSelectionOrientation.REAR_LEFT}
      />,
    );
    expect(dynamicSVGModuleMock.DynamicSVG).toHaveBeenCalledTimes(2);
    expectPropsOnChildMockStrict(dynamicSVGModuleMock.DynamicSVG, {
      svg: wireFrame[VehicleModel.AUDIA7]?.[PartSelectionOrientation.REAR_LEFT],
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
    render(<VehicleDynamicWireframe vehicleModel={VehicleModel.AUDIA7} onClickPart={mockFn} />);
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
        vehicleModel={VehicleModel.AUDIA7}
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
        vehicleModel={VehicleModel.AUDIA7}
        getPartAttributes={getPartAttributes}
      />,
    );
    expect(getPartAttributes).toBeCalled();
    expect(document.querySelector('svg')?.getAttribute('style')).toBe(
      'fill: red; pointer-events: fill; cursor: pointer;',
    );
  });
});
