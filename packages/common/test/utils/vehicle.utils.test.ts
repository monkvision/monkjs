import { VehicleModel, VehicleType } from '@monkvision/types';
import { getVehicleModel } from '../../src';

describe('getVehicleModel', () => {
  it('should return the correct vehicle model for a given vehicle type', () => {
    const vehicleType = VehicleType.PICKUP;
    const expectedModel = VehicleModel.FF150;
    expect(getVehicleModel(vehicleType)).toBe(expectedModel);
  });

  it('should return the correct vehicle model for SUV type', () => {
    const vehicleType = VehicleType.SUV;
    const expectedModel = VehicleModel.FESC20;
    expect(getVehicleModel(vehicleType)).toBe(expectedModel);
  });

  it('should return the correct vehicle model for CUV type', () => {
    const vehicleType = VehicleType.CUV;
    const expectedModel = VehicleModel.FESC20;
    expect(getVehicleModel(vehicleType)).toBe(expectedModel);
  });

  it('should throw an error if no vehicle model is found', () => {
    const vehicleType = VehicleType.HATCHBACK;
    expect(() => getVehicleModel(vehicleType)).toThrow(
      `No vehicle model found for vehicle type ${vehicleType}`,
    );
  });
});
