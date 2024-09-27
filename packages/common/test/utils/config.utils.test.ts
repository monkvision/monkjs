import { CaptureAppConfig, SteeringWheelPosition, VehicleType } from '@monkvision/types';
import { getAvailableVehicleTypes } from '../../src';

describe('Config utils', () => {
  describe('getAvailableVehicleTypes function', () => {
    it('should return the list of available vehicle types in non-steering wheel sights', () => {
      const config = {
        enableSteeringWheelPosition: false,
        sights: { [VehicleType.SEDAN]: [], [VehicleType.HGV]: [] },
      } as unknown as CaptureAppConfig;
      expect(getAvailableVehicleTypes(config)).toEqual([VehicleType.SEDAN, VehicleType.HGV]);
    });

    it('should return the list of available vehicle types in steering wheel enabled sights', () => {
      const config = {
        enableSteeringWheelPosition: true,
        sights: {
          [SteeringWheelPosition.LEFT]: { [VehicleType.VAN]: [], [VehicleType.CITY]: [] },
          [SteeringWheelPosition.RIGHT]: { [VehicleType.VAN]: [], [VehicleType.CITY]: [] },
        },
      } as unknown as CaptureAppConfig;
      expect(getAvailableVehicleTypes(config)).toEqual([VehicleType.VAN, VehicleType.CITY]);
    });

    it('should return the list of available vehicle types in steering wheel enabled sights with different sights for each side', () => {
      const config = {
        enableSteeringWheelPosition: true,
        sights: {
          [SteeringWheelPosition.LEFT]: { [VehicleType.VAN]: [], [VehicleType.LARGE_SUV]: [] },
          [SteeringWheelPosition.RIGHT]: { [VehicleType.VAN]: [], [VehicleType.HATCHBACK]: [] },
        },
      } as unknown as CaptureAppConfig;
      expect(getAvailableVehicleTypes(config)).toEqual([
        VehicleType.VAN,
        VehicleType.LARGE_SUV,
        VehicleType.HATCHBACK,
      ]);
    });
  });
});
