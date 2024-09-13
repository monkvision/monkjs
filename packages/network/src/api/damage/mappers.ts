import { ApiDamagePost } from '../models';

export function mapApiDamagePost(damageType: string, partType: string): ApiDamagePost {
  return {
    damage_type: damageType,
    part_type: partType,
  };
}
