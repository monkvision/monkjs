import {
  MonkEntityType,
  PricingV2,
  PricingV2RelatedItemType,
  RepairOperationType,
  VehiclePart,
} from '@monkvision/types';
import { ApiPricingPost, ApiPricingV2Details } from '../models';
import { PricingOptions } from './types';

export function mapApiPricingPost(inspectionId: string, response: ApiPricingV2Details): PricingV2 {
  return {
    inspectionId,
    id: response.id,
    entityType: MonkEntityType.PRICING,
    relatedItemType: response.related_item_type as PricingV2RelatedItemType,
    relatedItemId: response.related_item_id,
    pricing: response.pricing,
    operations: response.operations as RepairOperationType[] | undefined,
    hours: response.hours,
  };
}

export function mapApiPricingPostRequest(options: PricingOptions): ApiPricingPost {
  return {
    pricing: options.pricing >= 0 ? options.pricing : 0,
    related_item_type: options.type,
    part_type:
      options.type === PricingV2RelatedItemType.PART ? options.vehiclePart : VehiclePart.IGNORE,
  };
}
