import { Dispatch } from 'react';
import {
  MonkActionType,
  MonkCreatedOnePricingAction,
  MonkDeletedOnePricingAction,
  MonkUpdatedOnePricingAction,
} from '@monkvision/common';
import ky from 'ky';
import { getDefaultOptions, MonkApiConfig } from '../config';
import { MonkApiResponse } from '../types';
import { ApiIdColumn, ApiPricingV2Details } from '../models';
import { mapApiPricingPost, mapApiPricingPostRequest } from './mappers';
import { PricingOptions } from './types';

/**
 * Options passed to the `createPricing` API request.
 */
export interface CreatePricingOptions {
  /**
   * The ID of the inspection to update via the API.
   */
  id: string;
  /**
   * Pricing used for the update operation.
   */
  pricing: PricingOptions;
}

/**
 * Create a new pricing with the given options. See the `CreatePricingOptions` interface for more details.
 *
 * @param options The options of the inspection.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 * @see CreatePricingOptions
 */

export async function createPricing(
  options: CreatePricingOptions,
  config: MonkApiConfig,
  dispatch?: Dispatch<MonkCreatedOnePricingAction>,
): Promise<MonkApiResponse> {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.post(`inspections/${options.id}/pricing`, {
    ...kyOptions,
    json: mapApiPricingPostRequest(options.pricing),
  });
  const body = await response.json<ApiPricingV2Details>();
  const pricing = mapApiPricingPost(options.id, body);
  dispatch?.({
    type: MonkActionType.CREATED_ONE_PRICING,
    payload: { pricing },
  });
  return {
    id: body.id,
    response,
    body,
  };
}

/**
 * Options passed to the `deletePricing` API request.
 */
export interface DeletePricingOptions {
  /**
   * The ID of the inspection to update via the API.
   */
  id: string;
  /**
   * Pricing ID that will be deleted.
   */
  pricingId: string;
}

/**
 * Delete a pricing with the given options. See the `DeletePricingOptions` interface for more details.
 *
 * @param options The options of the inspection.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 * @see DeletePricingOptions
 */

export async function deletePricing(
  options: DeletePricingOptions,
  config: MonkApiConfig,
  dispatch?: Dispatch<MonkDeletedOnePricingAction>,
): Promise<MonkApiResponse> {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.delete(`inspections/${options.id}/pricing/${options.pricingId}`, {
    ...kyOptions,
  });
  const body = await response.json<ApiIdColumn>();
  dispatch?.({
    type: MonkActionType.DELETED_ONE_PRICING,
    payload: { inspectionId: options.id, pricingId: body.id },
  });
  return {
    id: body.id,
    response,
    body,
  };
}

/**
 * Options passed to the `updatePricing` API request.
 */
export interface UpdatePricingOptions {
  /**
   * The ID of the inspection to update via the API.
   */
  id: string;
  /**
   * Pricing ID that will be update.
   */
  pricingId: string;
  /**
   * The new price value.
   */
  price: number;
}

/**
 * Update a pricing with the given options. See the `UpdatePricingOptions` interface for more details.
 *
 * @param options The options of the inspection.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 * @see UpdatePricingOptions
 */

export async function updatePricing(
  options: UpdatePricingOptions,
  config: MonkApiConfig,
  dispatch?: Dispatch<MonkUpdatedOnePricingAction>,
): Promise<MonkApiResponse> {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.patch(`inspections/${options.id}/pricing/${options.pricingId}`, {
    ...kyOptions,
    json: { pricing: options.price },
  });
  const body = await response.json<ApiPricingV2Details>();
  const pricing = mapApiPricingPost(options.id, body);
  dispatch?.({
    type: MonkActionType.UPDATED_ONE_PRICING,
    payload: { pricing },
  });
  return {
    id: body.id,
    response,
    body,
  };
}
