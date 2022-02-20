import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import ACTIONS from '../actionTypes';
import entity from '../entity';
import * as api from '../api';

export const entityAdapter = createEntityAdapter();

/**
 * getOneInspectionById
 * @param id: {string}
 * @param [params]: {Object}
 * @param [params.show_deleted_objects=false]: {boolean}
 * @param requestConfig: : {Object}
 * @return {Promise<{data, response: *, normalizedData: NormalizedSchema}>}
 */
export const getOneInspectionById = async ({ id, params, ...requestConfig }) => {
  const response = await api.getOne({ id, params, ...requestConfig });
  const { data } = response;
  const normalizedData = normalize(data, entity);

  return ({ data, normalizedData, response });
};

/**
 * getOneInspectionByIdThunk
 * @type {AsyncThunk<NormalizedSchema>}
 */
export const getOneInspectionByIdThunk = createAsyncThunk(
  ACTIONS.GET_ONE,
  getOneInspectionById,
);

/**
 * getAllInspections
 * @param arg
 * @return {Promise<{data, response: *, normalizedData: NormalizedSchema}>}
 */
export const getAllInspections = async (arg) => {
  const response = await api.getAll({ ...arg });
  const { data } = response;
  const normalizedData = normalize(data, { data: [entity] });

  return ({ data, normalizedData, response });
};

/**
 * getAllInspectionsThunk
 * @type {AsyncThunk<NormalizedSchema>}
 */
export const getAllInspectionsThunk = createAsyncThunk(
  ACTIONS.GET_ALL,
  getAllInspections,
);

/**
 * createOneInspection
 * @param arg
 * @return {Promise<{data, response: *, normalizedData: NormalizedSchema}>}
 */
export const createOneInspection = async (arg) => {
  const response = await api.createOne({ ...arg });
  const { data } = response;
  const normalizedData = normalize(data, entity);

  return ({ data, normalizedData, response });
};

/**
 * createOneInspectionThunk
 * @type {AsyncThunk<NormalizedSchema>}
 */
export const createOneInspectionThunk = createAsyncThunk(
  ACTIONS.CREATE_ONE,
  createOneInspection,
);

/**
 * updateOneInspection
 * @param arg
 * @return {Promise<{data, response: *, normalizedData: NormalizedSchema}>}
 */
export const updateOneInspection = async (arg) => {
  const response = await api.updateOne({ ...arg });
  const { data } = response;
  const normalizedData = { ...normalize(data, entity), ...arg };

  return ({ data, normalizedData, response });
};

/**
 * updateOneInspectionThunk
 * @type {AsyncThunk<NormalizedSchema>}
 */
export const updateOneInspectionThunk = createAsyncThunk(
  ACTIONS.UPDATE_ONE,
  updateOneInspection,
);

/**
 * updateOneInspectionAdditionalData
 * @param arg
 * @return {Promise<{data, response: *, normalizedData: NormalizedSchema}>}
 */
export const updateOneInspectionAdditionalData = async (arg) => {
  const response = await api.updateOneAdditionalData({ ...arg });
  const { data } = response;
  const normalizedData = { ...normalize(data, entity), ...arg };

  return ({ data, normalizedData, response });
};

/**
 * updateOneInspectionAdditionalDataThunk
 * @type {AsyncThunk<NormalizedSchema>}
 */
export const updateOneInspectionAdditionalDataThunk = createAsyncThunk(
  ACTIONS.UPDATE_ONE_ADDITIONAL_DATA,
  updateOneInspectionAdditionalData,
);

/**
 * deleteOneInspection
 * @param arg
 * @return {Promise<{response: AxiosResponse, arg}>}
 */
export const deleteOneInspection = async (arg) => {
  const response = await api.deleteOne({ ...arg });
  return ({ arg, response });
};

/**
 * deleteOneInspectionThunk
 * @type {AsyncThunk<NormalizedSchema>}
 */
export const deleteOneInspectionThunk = createAsyncThunk(
  ACTIONS.DELETE_ONE,
  deleteOneInspection,
);

/**
 * upsertReducer
 * @param state
 * @param action
 */
function upsertReducer(state, action) {
  const { inspections } = action.payload.entities;
  const { reset } = action.meta.arg;
  if (reset) { entityAdapter.removeAll(state); }
  if (inspections) { entityAdapter.upsertMany(state, inspections); }
}

/**
 * inspectionsSlice
 * @type {Slice<EntityState<unknown> & {entities: {}, ids: *[]}, {}, string>}
 */
export const slice = createSlice({
  name: 'inspections',
  initialState: entityAdapter.getInitialState({
    entities: {},
    ids: [],
  }),
  reducers: {},
  /**
   * Based on Entity Adapter
   * @param builder
   * @link https://redux-toolkit.js.org/api/createEntityAdapter#crud-functions
   * @link https://ngrx.io/guide/entity/adapter#adapter-collection-methods
   */
  extraReducers: (builder) => {
    // UPSERT REDUCERS
    builder.addCase(getAllInspections.fulfilled, upsertReducer);
    builder.addCase(createOneInspection.fulfilled, upsertReducer);
    builder.addCase(updateOneInspectionAdditionalData.fulfilled, upsertReducer);
    // END OF UPSERT

    builder.addCase(getOneInspectionById.fulfilled, (state, action) => {
      const { entities, result } = action.payload;
      entityAdapter.setOne(state, entities.inspections[result]);
    });

    builder.addCase(updateOneInspection.fulfilled, (state, action) => {
      const { entities, id } = action.payload;
      const { inspections } = entities;
      entityAdapter.updateOne(state, id, inspections[id]);
    });

    builder.addCase(deleteOneInspection.fulfilled, (state, action) => {
      entityAdapter.removeOne(state, action.payload.id);
    });
  },
});

export default slice.reducer;
