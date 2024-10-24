jest.mock('../../../src/api/config', () => ({
  getDefaultOptions: jest.fn(() => ({ prefixUrl: 'getDefaultOptionsTest' })),
}));
jest.mock('../../../src/api/pricing/mappers', () => ({
  mapApiPricingPost: jest.fn(() => ({ test: 'hello' })),
  mapApiPricingPostRequest: jest.fn(() => ({ test: 'hello' })),
}));
jest.mock('ky', () => ({
  post: jest.fn(() =>
    Promise.resolve({ json: jest.fn(() => Promise.resolve({ id: 'test-fake-id' })) }),
  ),
  delete: jest.fn(() =>
    Promise.resolve({ json: jest.fn(() => Promise.resolve({ id: 'test-fake-id' })) }),
  ),
  patch: jest.fn(() =>
    Promise.resolve({ json: jest.fn(() => Promise.resolve({ id: 'test-fake-id' })) }),
  ),
}));

import { MonkEntityType, PricingV2RelatedItemType, VehiclePart } from '@monkvision/types';
import {
  createPricing,
  deletePricing,
  PricingOptions,
  updatePricing,
} from '../../../src/api/pricing';
import { MonkActionType } from '@monkvision/common';
import ky from 'ky';
import { getDefaultOptions } from '../../../src/api/config';
import { mapApiPricingPost, mapApiPricingPostRequest } from '../../../src/api/pricing/mappers';

const apiConfig = {
  apiDomain: 'apiDomain',
  authToken: 'authToken',
  thumbnailDomain: 'thumbnailDomain',
};

describe('Pricing requests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPricing request', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should make the proper API call and map the resulting response', async () => {
      const id = 'test-inspection-id';
      const dispatch = jest.fn();
      const pricing: PricingOptions = {
        type: PricingV2RelatedItemType.PART,
        vehiclePart: VehiclePart.ROOF,
        pricing: 50,
      };
      const result = await createPricing({ id, pricing }, apiConfig, dispatch);
      const response = await (ky.post as jest.Mock).mock.results[0].value;
      const body = await response.json();

      const apiPricing = (mapApiPricingPost as jest.Mock).mock.results[0].value;
      const apiPricingPost = (mapApiPricingPostRequest as jest.Mock).mock.results[0].value;
      expect(mapApiPricingPost).toHaveBeenCalledWith(id, body);
      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      const kyOptions = getDefaultOptions(apiConfig);
      expect(ky.post).toHaveBeenCalledWith(`inspections/${id}/pricing`, {
        ...kyOptions,
        json: apiPricingPost,
      });
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: MonkActionType.CREATED_ONE_PRICING,
        payload: {
          pricing: {
            entityType: MonkEntityType.PRICING,
            id: expect.any(String),
            inspectionId: id,
            relatedItemType: pricing.type,
            pricing: pricing.pricing,
            relatedItemId:
              pricing.type === PricingV2RelatedItemType.PART ? pricing.vehiclePart : undefined,
          },
        },
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: MonkActionType.CREATED_ONE_PRICING,
        payload: { pricing: apiPricing, localId: expect.any(String) },
      });
      expect(result).toEqual({
        id: body.id,
        response,
        body,
      });
    });
  });

  describe('deletePricing request', () => {
    it('should make the proper API call and map the resulting response', async () => {
      const id = 'test-inspection-id';
      const pricingId = 'test-pricing-id';
      const dispatch = jest.fn();
      const result = await deletePricing({ id, pricingId }, apiConfig, dispatch);
      const response = await (ky.delete as jest.Mock).mock.results[0].value;
      const body = await response.json();

      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      const kyOptions = getDefaultOptions(apiConfig);
      expect(ky.delete).toHaveBeenCalledWith(`inspections/${id}/pricing/${pricingId}`, {
        ...kyOptions,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.DELETED_ONE_PRICING,
        payload: { inspectionId: id, pricingId: body.id },
      });
      expect(result).toEqual({
        id: body.id,
        response,
        body,
      });
    });
  });

  describe('updatePricing request', () => {
    it('should make the proper API call and map the resulting response', async () => {
      const id = 'test-inspection-id';
      const pricingId = 'test-pricing-id';
      const pricingMock = 50;
      const dispatch = jest.fn();
      const result = await updatePricing({ id, pricingId, price: 50 }, apiConfig, dispatch);
      const response = await (ky.patch as jest.Mock).mock.results[0].value;
      const body = await response.json();

      const apiPricing = (mapApiPricingPost as jest.Mock).mock.results[0].value;
      expect(getDefaultOptions).toHaveBeenCalledWith(apiConfig);
      const kyOptions = getDefaultOptions(apiConfig);
      expect(ky.patch).toHaveBeenCalledWith(`inspections/${id}/pricing/${pricingId}`, {
        ...kyOptions,
        json: {
          pricing: pricingMock,
        },
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: MonkActionType.UPDATED_ONE_PRICING,
        payload: { pricing: apiPricing },
      });
      expect(result).toEqual({
        id: body.id,
        response,
        body,
      });
    });
  });
});
