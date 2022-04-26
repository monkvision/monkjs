import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { camelCase, isEmpty, isNil, omitBy, snakeCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep-lodash';

import { normalize } from 'normalizr';
import config from '../config';

import createEntityReducer from '../createEntityReducer';
import { GotOneImagePayload } from '../images/reduxTypes';
import { IdResponse, RootState } from '../sharedTypes';
import { GetOneTaskResponse } from '../tasks/apiTypes';
import {
  AddAdditionalInfoResponse,
  AdditionalInfoAddedToInspection,
  CreatedInspection,
  CreateInspection,
  CreateOneInspectionResponse,
  DeleteOneInspectionResponse,
  GetManyInspectionsOptions,
  GetManyInspectionsResponse,
  GetOneInspectionOptions,
  GetOneInspectionResponse,
  InspectionPaginatedResponse,
} from './apiTypes';
import { Inspection, NormalizedInspection, PdfInputData } from './entityTypes';
import { InspectionPayloadTypes } from './reduxTypes';

import schema, { idAttribute, key } from './schema';

export const name = key;

function mapCreatedInspection(id: string, createInspection: CreateInspection, createdAt?: string): CreatedInspection {
  return {
    id,
    createdAt,
    inspectionType: createInspection.inspectionType,
    accidentNature: createInspection.accidentNature,
    relatedInspectionId: createInspection.relatedInspectionId,
    additionalData: createInspection.additionalData,
    usageDuration: createInspection.usageDuration,
  };
}

/**
 * Get one inspection by ID.
 *
 * @param {string} id The uuid of the inspection to get.
 * @param {GetOneInspectionOptions} [options] The fetch options.
 */
export async function getOne(id: string, options?: GetOneInspectionOptions): Promise<GetOneInspectionResponse> {
  const params = mapKeysDeep(options, (v, k) => snakeCase(k));
  const axiosResponse = await axios.request<Inspection>({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections/${id}`,
    params: omitBy(params, isNil),
  });

  return {
    axiosResponse,
    [idAttribute]: id,
    ...normalize(mapKeysDeep(axiosResponse.data, (v, k) => camelCase(k)), schema),
  };
}

/**
 * Get a page of inspection entities.
 *
 * @param {GetManyInspectionsOptions} [options] - The query options.
 */
export async function getMany(options?: GetManyInspectionsOptions): Promise<GetManyInspectionsResponse> {
  const params = mapKeysDeep(options, (v, k) => snakeCase(k));
  const axiosResponse = await axios.request<InspectionPaginatedResponse>({
    ...config.axiosConfig,
    method: 'get',
    url: '/inspections',
    params: omitBy(params, isNil),
  });

  return {
    axiosResponse,
    ...normalize(mapKeysDeep(axiosResponse.data.data, (v, k) => camelCase(k)), [schema]),
  };
}

/**
 * Create a new inspection.
 *
 * @param {CreateInspection} createInspection - The details of the inspection to create.
 */
export async function createOne(createInspection: CreateInspection): Promise<CreateOneInspectionResponse> {
  const axiosResponse = await axios.request<IdResponse<'id'>>({
    ...config.axiosConfig,
    method: 'post',
    url: '/inspections',
    data: mapKeysDeep(createInspection, (v, k) => snakeCase(k)),
  });
  const id = axiosResponse.data[idAttribute];
  const createdEntity = mapCreatedInspection(id, createInspection, new Date().toISOString());

  return {
    axiosResponse,
    [idAttribute]: id,
    ...normalize(createdEntity, schema),
  };
}

/**
 * Add additional information to an inspection.
 *
 * @param {string} id - The id of the inspection.
 * @param {PdfInputData} data - The additional information to add to the inspection.
 */
export async function addAdditionalDataToOne(id: string, data: PdfInputData): Promise<AddAdditionalInfoResponse> {
  const axiosResponse = await axios.request<IdResponse<'id'>>({
    ...config.axiosConfig,
    method: 'patch',
    url: `/inspections/${id}/pdf_data`,
    data: mapKeysDeep(data, (v, k) => snakeCase(k)),
  });

  const entity: AdditionalInfoAddedToInspection = {
    [idAttribute]: id,
    additionalData: {
      pdfData: data,
    },
  };

  return {
    axiosResponse,
    [idAttribute]: id,
    ...normalize(entity, schema),
  };
}

/**
 * Delete an inspection.
 *
 * @param {string} id - The id of the inspection.
 */
export async function deleteOne(id: string): Promise<DeleteOneInspectionResponse> {
  const axiosResponse = await axios.request<IdResponse<'id'>>({
    ...config.axiosConfig,
    method: 'delete',
    url: `/inspections/${id}`,
  });

  const result = {
    [idAttribute]: id,
  };

  return {
    axiosResponse,
    [idAttribute]: id,
    ...normalize(result, schema),
  };
}

function emptyInspection(id: string): NormalizedInspection {
  return {
    [idAttribute]: id,
    images: [],
    damages: [],
    parts: [],
    wheelAnalysis: [],
    tasks: [],
    documents: [],
    severityResults: [],
  };
}

export const entityAdapter = createEntityAdapter<NormalizedInspection>({});
export const entityReducer = createEntityReducer<NormalizedInspection, InspectionPayloadTypes>(key, entityAdapter);
export const selectors = entityAdapter.getSelectors((state: RootState) => state[key]);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
  extraReducers: (builder) => {
    builder.addCase('tasks/gotOne', (
      state: EntityState<NormalizedInspection>,
      action: PayloadAction<GetOneTaskResponse, 'tasks/gotOne'>,
    ) => {
      const { result, inspectionId } = action.payload;

      if (inspectionId && !isEmpty(result)) {
        const inspection: NormalizedInspection = state.entities[inspectionId] ?? emptyInspection(inspectionId);

        entityAdapter.upsertOne(state, {
          ...inspection,
          tasks: Array.from(new Set([...inspection.tasks, result.id])),
        });
      }
    }).addCase('images/gotOne', (
      state: EntityState<NormalizedInspection>,
      action: PayloadAction<GotOneImagePayload, 'images/gotOne'>,
    ) => {
      const { result, inspectionId } = action.payload;

      if (inspectionId && !isEmpty(result)) {
        const inspection: NormalizedInspection = state.entities[inspectionId] ?? emptyInspection(inspectionId);

        entityAdapter.upsertOne(state, {
          ...inspection,
          images: Array.from(new Set([...inspection.images, result.id])),
        });
      }
    });
  },
});
