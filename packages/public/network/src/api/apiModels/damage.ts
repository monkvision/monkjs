import type { ApiRelatedImages } from './image';
import type { ApiPartIds } from './part';

export interface ApiDamage {
  damage_size_cm?: number;
  damage_type: string;
  id: string;
  part_ids: ApiPartIds;
  related_images?: ApiRelatedImages;
}

export type ApiDamages = ApiDamage[];

export type ApiDamageIds = string[];
