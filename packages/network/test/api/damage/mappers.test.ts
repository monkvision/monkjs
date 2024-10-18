import { DamageType, VehiclePart } from '@monkvision/types';
import { mapApiDamagePostRequest } from '../../../src/api/damage/mappers';

function createApiDamagePost() {
  return {
    damageType: DamageType.RUSTINESS,
    vehiclePart: VehiclePart.ROCKER_PANEL,
  };
}

describe('Damage API Mappers', () => {
  describe('ApiDamagePost mapper', () => {
    it('should properly map the ApiDamagePost object', () => {
      const apiDamagePostData = createApiDamagePost();
      const result = mapApiDamagePostRequest(
        apiDamagePostData.damageType,
        apiDamagePostData.vehiclePart,
      );
      expect(result).toEqual({
        damage_type: apiDamagePostData.damageType,
        part_type: apiDamagePostData.vehiclePart,
      });
    });
  });
});
