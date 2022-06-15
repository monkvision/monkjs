import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { camelCase, isEmpty, isNil, omitBy, snakeCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep-lodash';

import { normalize } from 'normalizr';
import config from '../config';

import createEntityReducer from '../createEntityReducer';
import { GetOneImageResponse } from '../images/apiTypes';
import { Image } from '../images/entityTypes';
import { Callback, IdResponse, RootState } from '../sharedTypes';
import { GetOneTaskResponse } from '../tasks/apiTypes';
import { TaskName, WheelAnalysisDetails } from '../tasks/entityTypes';
import { WheelAnalysis, WheelTypeByPrediction, WheelTypePrediction } from '../wheelAnalysis/entityTypes';
import {
  AddAdditionalInfoResponse,
  AdditionalInfoAddedToInspection,
  CreatedInspection,
  CreateInspection,
  CreateOneInspectionResponse,
  DeleteOneInspectionResponse,
  GetInspectionReportPdf,
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
    tasks: [],
  };
}

function mapCreateInspectionKeysToSnakeCase(createInspection: CreateInspection): unknown {
  const taskCallbacks = new Map<string, Callback[] | undefined>();
  taskCallbacks.set('wheel_analysis', createInspection.tasks.wheelAnalysis?.callbacks);
  taskCallbacks.set('repair_estimate', createInspection.tasks.repairEstimate?.callbacks);
  taskCallbacks.set('images_ocr', createInspection.tasks.imagesOcr?.callbacks);
  taskCallbacks.set('damage_detection', createInspection.tasks.damageDetection?.callbacks);

  const result = mapKeysDeep(createInspection, (v, k) => snakeCase(k));
  taskCallbacks.forEach((callbacks, snakeCaseTask) => {
    if (callbacks) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      result.tasks[snakeCaseTask].callbacks = callbacks;
    }
  });

  return result;
}

/**
 * Note(Ilyass): Since there is still a bug from BE, which is wheel_analysis property
 * is always null, as a workaround we are pulling wheel_analysis from images, and wheelName
 * from tasks.images.details.wheel_name
 */
function getWheelAnalysis(inspection: Inspection): WheelAnalysis[] {
  // we try to get the WA from the root of the inspection, if we can't, we get it from images
  if (inspection.wheelAnalysis) { return inspection.wheelAnalysis; }

  const wheelAnalysisTask = inspection.tasks.find((task) => task.name === TaskName.WHEEL_ANALYSIS);
  const getTaskImageById = (imageId: string) => wheelAnalysisTask.images.find((img) => img.imageId === imageId);

  const getWheelName = (image: Image) => {
    // we try to get the wheelname from tasks (will be present only if we pass
    // them while creating the task)
    const taskDetails = getTaskImageById(image.id)?.details as WheelAnalysisDetails | undefined;
    if (taskDetails?.wheelName) { return taskDetails.wheelName; }

    // if always no wheelName we try to predict a wheelName from the viewpoint
    return WheelTypeByPrediction[image?.viewpoint?.prediction as WheelTypePrediction] ?? '';
  };

  return inspection.images?.filter((img) => img?.wheelAnalsis)
    .map((img) => ({
      ...img.wheelAnalsis,
      wheelName: getWheelName(img) || img.wheelAnalsis.wheelName,
      imageId: img.id,
    }) as WheelAnalysis);
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

  const inspection = mapKeysDeep(
    axiosResponse.data,
    (v, k) => camelCase(k),
  ) as unknown as Inspection;
  const wheelAnalysis = getWheelAnalysis(inspection);
  const inspectionWithWheelAnalysis = {
    ...inspection,
    wheelAnalysis,
  };

  return {
    axiosResponse,
    [idAttribute]: id,
    ...normalize(inspectionWithWheelAnalysis, schema),
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
    data: mapCreateInspectionKeysToSnakeCase(createInspection),
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
 */
export async function getInspectionReportPdf(id: string): Promise<GetInspectionReportPdf> {
  const axiosResponse = await axios.request<IdResponse<'url'>>({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections/${id}/pdf`,
  });

  const entity: IdResponse<'id'>= {
    [idAttribute]: id,
  };

  return {
    axiosResponse,
    [idAttribute]: id,
    ...normalize(entity, schema),
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
          tasks: Array.from(new Set([...inspection.tasks, result])),
        });
      }
    }).addCase('images/gotOne', (
      state: EntityState<NormalizedInspection>,
      action: PayloadAction<GetOneImageResponse, 'images/gotOne'>,
    ) => {
      const { result, inspectionId } = action.payload;

      if (inspectionId && !isEmpty(result)) {
        const inspection: NormalizedInspection = state.entities[inspectionId] ?? emptyInspection(inspectionId);

        entityAdapter.upsertOne(state, {
          ...inspection,
          images: Array.from(new Set([...inspection.images, result])),
        });
      }
    });
  },
});
