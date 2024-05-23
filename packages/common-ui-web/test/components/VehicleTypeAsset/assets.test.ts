import { VehicleTypeAssetsMap } from '../../../src/components/VehicleTypeAsset/assets';
import { VehicleType } from '@monkvision/types';

describe('VehicleTypeAsset assets map', () => {
  it('should be defined', () => {
    expect(typeof VehicleTypeAssetsMap).toBe('object');
  });

  it('should have a defined asset for every vehicle type available in the SDK', () => {
    Object.values(VehicleType).forEach((vehicleType) => {
      expect(typeof VehicleTypeAssetsMap[vehicleType]).toBe('string');
      expect(VehicleTypeAssetsMap[vehicleType].length).toBeGreaterThan(0);
    });
  });
});
