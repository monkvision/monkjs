const { getVehicleTypes, getInitialSelectedVehicleType } = jest.requireActual(
  '../../../src/components/VehicleTypeSelection/utils',
);
jest.mock('../../../src/components/Button', () => ({
  Button: jest.fn(() => <></>),
}));
jest.mock('../../../src/components/VehicleTypeSelection/VehicleTypeSelectionCard', () => ({
  VehicleTypeSelectionCard: jest.fn(() => <></>),
}));
jest.mock('@monkvision/sights', () => [{ id: 'test-sight-id' }]);
jest.mock('../../../src/components/VehicleTypeSelection/utils', () => ({
  getVehicleTypeFromInspection: jest.fn(() => 'test-vehicle-type'),
  getVehicleTypes,
  getInitialSelectedVehicleType,
}));

import { act, render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button, VehicleTypeSelection } from '../../../src';
import { VehicleTypeSelectionCard } from '../../../src/components/VehicleTypeSelection/VehicleTypeSelectionCard';
import { VehicleType } from '@monkvision/types';
import { useMonkAppState } from '@monkvision/common';
import { useMonkApi } from '@monkvision/network';

const appState = {
  authToken: 'test-auth-token',
  inspectionId: 'test-inspection-id',
  apiDomain: 'test-api-domain',
  thumbnailDomain: 'test-thumbnail-domain',
};

describe('VehicleTypeSelection component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a card for each vehicle type', () => {
    const availableVehicleTypes: VehicleType[] = [VehicleType.HATCHBACK, VehicleType.CITY];
    const { unmount } = render(
      <VehicleTypeSelection availableVehicleTypes={availableVehicleTypes} />,
    );

    availableVehicleTypes.forEach((vehicleType) => {
      expectPropsOnChildMock(VehicleTypeSelectionCard, {
        vehicleType,
      });
    });
    (Object.values(VehicleType) as unknown as VehicleType[])
      .filter((vehicleType: VehicleType) => !(availableVehicleTypes as VehicleType[]).includes(vehicleType))
      .forEach((vehicleType) => {
        expect(VehicleTypeSelectionCard).not.toHaveBeenCalledWith(
          expect.objectContaining({
            vehicleType,
          }),
          expect.anything(),
        );
      });

    unmount();
  });

  it('should select a vehicle when clicking on a card', () => {
    const availableVehicleTypes = [VehicleType.HATCHBACK, VehicleType.CITY, VehicleType.CUV];
    const { unmount } = render(
      <VehicleTypeSelection availableVehicleTypes={availableVehicleTypes} />,
    );

    expectPropsOnChildMock(VehicleTypeSelectionCard, {
      vehicleType: availableVehicleTypes[0],
      isSelected: false,
      onClick: expect.any(Function),
    });
    const { onClick } = (VehicleTypeSelectionCard as jest.Mock).mock.calls.find(
      (args) => args[0].vehicleType === availableVehicleTypes[0],
    )[0];
    expect(VehicleTypeSelectionCard).not.toHaveBeenCalledWith(
      expect.objectContaining({
        vehicleType: availableVehicleTypes[0],
        isSelected: true,
      }),
      expect.anything(),
    );
    act(() => onClick());
    expectPropsOnChildMock(VehicleTypeSelectionCard, {
      vehicleType: availableVehicleTypes[0],
      isSelected: true,
    });

    unmount();
  });

  it('should display a confirm button that confirms the current user choice', () => {
    const onSelectVehicleType = jest.fn();
    const { unmount } = render(<VehicleTypeSelection onSelectVehicleType={onSelectVehicleType} />);

    const { vehicleType } = (VehicleTypeSelectionCard as jest.Mock).mock.calls.find(
      (args) => args[0].isSelected,
    )[0];
    expectPropsOnChildMock(Button, {
      children: 'header.confirm',
    });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls.find(
      (args) => args[0].children === 'header.confirm',
    )[0];

    expect(onSelectVehicleType).not.toHaveBeenCalled();
    onClick();
    expect(onSelectVehicleType).toHaveBeenCalledWith(vehicleType);

    unmount();
  });

  it('should trigger the onSelectVehicle if VehicleType is found in the fetched inspection', async () => {
    const onSelectVehicleType = jest.fn();
    (useMonkAppState as jest.Mock).mockImplementation(() => appState);
    const imageMock = {
      entities: { images: [{ sightId: 'test-sight-id' }] },
    };
    const availableVehicleTypesMock = ['test-vehicle-type'] as unknown as VehicleType[];
    const getInspection = jest.fn(() => Promise.resolve(imageMock));
    (useMonkApi as jest.Mock).mockImplementation(() => ({ getInspection }));
    await act(async () => {
      render(
        <VehicleTypeSelection
          availableVehicleTypes={availableVehicleTypesMock}
          onSelectVehicleType={onSelectVehicleType}
          {...appState}
        />,
      );
    });

    expect(onSelectVehicleType).toHaveBeenCalled();
    expect(onSelectVehicleType).toHaveBeenCalledWith('test-vehicle-type');
  });
});
