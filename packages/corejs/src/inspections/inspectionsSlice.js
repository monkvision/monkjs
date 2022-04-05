import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import * as api from './inspectionsApi';
import { entity, entityCollection } from './inspectionsEntity';

export { default as inspectionStatuses } from './constants';
const mockInspection = require('./getOneInspectionMock.json');

export const inspectionsAdapter = createEntityAdapter();

export const getOneInspectionById = createAsyncThunk(
  'inspections/getOne',
  async (arg) => {
    console.warn('Wheel analysis is using mock data');
    const { data } = await api.getOne({ ...arg });
    const dataWithMock = {
      ...data,
      wheel_analysis: [...mockInspection.wheel_analysis],
      images: data.images?.length ? data.images.map((img, i) => {
        if (i < mockInspection.images.length) {
          return { ...img, wheel_analysis: mockInspection.images[i].wheel_analysis };
        }
        return img;
      }) : [] };

    return normalize(dataWithMock, entity);
  },
);

export const getAllInspections = createAsyncThunk(
  'inspections/getAll',
  async (arg) => {
    const { data } = await api.getAll({ ...arg });
    return normalize(data, { data: entityCollection });
  },
);

export const createOneInspection = createAsyncThunk(
  'inspections/createOne',
  async (arg) => {
    const { data } = await api.createOne({ ...arg });
    return normalize(data, entity);
  },
);

export const updateOneInspection = createAsyncThunk(
  'inspections/updateOne',
  async (arg) => {
    const { data } = await api.updateOne({ ...arg });
    return { ...normalize(data, entity), ...arg };
  },
);

export const updateOneInspectionAdditionalData = createAsyncThunk(
  'inspections/updateOneAdditionalData',
  async (arg) => {
    const { data } = await api.updateOneAdditionalData({ ...arg });
    return { ...normalize(data, entity), ...arg };
  },
);

export const deleteOneInspection = createAsyncThunk(
  'inspections/deleteOne',
  async (arg) => {
    await api.deleteOne({ ...arg });
    return arg;
  },
);

function upsertReducer(state, action) {
  const { inspections } = action.payload.entities;
  const { reset } = action.meta.arg;
  if (reset) {
    inspectionsAdapter.removeAll(state);
  }
  if (inspections) {
    inspectionsAdapter.upsertMany(state, inspections);
  }
}

export const slice = createSlice({
  name: 'inspections',
  initialState: inspectionsAdapter.getInitialState({
    entities: {},
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createOneInspection.fulfilled, upsertReducer);
    builder.addCase(getOneInspectionById.fulfilled, (state, action) => {
      const { entities, result } = action.payload;
      inspectionsAdapter.setOne(state, entities.inspections[result]);
    });
    builder.addCase(getAllInspections.fulfilled, upsertReducer);
    builder.addCase(updateOneInspection.fulfilled, (state, action) => {
      const { entities, id } = action.payload;
      const { inspections } = entities;
      inspectionsAdapter.updateOne(state, id, inspections[id]);
    });
    builder.addCase(deleteOneInspection.fulfilled, (state, action) => {
      inspectionsAdapter.removeOne(state, action.payload.id);
    });
    builder.addCase(updateOneInspectionAdditionalData.fulfilled, upsertReducer);
  },
});

export default slice.reducer;
