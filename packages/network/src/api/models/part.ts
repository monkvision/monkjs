import type { ApiDamageIds } from './damage';
import type { ApiRelatedImages } from './image';

export interface ApiPart {
  damage_ids: ApiDamageIds;
  id: string;
  part_type: string;
  related_images?: ApiRelatedImages;
}

export interface ApiPartSimplifiedGet {
  id: string;
  part_type: string;
}

export type ApiParts = ApiPart[];

export type ApiPartIds = string[];
