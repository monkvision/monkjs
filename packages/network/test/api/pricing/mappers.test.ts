import { MonkEntityType, PricingV2RelatedItemType } from '@monkvision/types';
import { mapApiPricingPost } from '../../../src/api/pricing/mappers';
import { ApiPricingV2Details } from '../../../src/api/models';

function createApiPricingPost(): ApiPricingV2Details {
  return {
    id: 'id-test',
    related_item_type: PricingV2RelatedItemType.PART,
    pricing: 10,
  };
}

describe('Pricing API Mappers', () => {
  const inspectionId = 'test-inspection-id';
  describe('ApiPricingPost mapper', () => {
    it('should properly map the ApiPricingPost object', () => {
      const apiPricingPostData = createApiPricingPost();
      const result = mapApiPricingPost(inspectionId, createApiPricingPost());
      expect(result).toEqual({
        id: apiPricingPostData.id,
        entityType: MonkEntityType.PRICING,
        hours: apiPricingPostData.hours,
        inspectionId,
        operations: apiPricingPostData.operations,
        pricing: apiPricingPostData.pricing,
        relatedItemId: apiPricingPostData.related_item_id,
        relatedItemType: apiPricingPostData.related_item_type,
      });
    });
  });
});
