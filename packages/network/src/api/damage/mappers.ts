import { DamageType, VehiclePart } from '@monkvision/types';
import { ApiDamagePost } from '../models';

export function mapApiDamagePostRequest(
  damageType: DamageType,
  vehiclePart: VehiclePart,
): ApiDamagePost {
  return {
    damage_type: damageType,
    part_type: vehiclePart,
  };
}
