import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import * as api from './inspectionsApi';
import { entity, entityCollection } from './inspectionsEntity';

export { default as inspectionStatuses } from './constants';
export const inspectionsAdapter = createEntityAdapter();

export const getOneInspectionById = createAsyncThunk(
  'inspections/getOne',
  async (arg) => {
    const { data } = await api.getOne({ ...arg });
    return normalize(data, entity);
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

export const deleteOneInspection = createAsyncThunk(
  'inspections/deleteOne',
  async (arg) => {
    await api.deleteOne({ ...arg });
    return arg;
  },
);

function upsertReducer(state, action) {
  state.history.push(action);

  const { inspections } = action.payload.entities;
  inspectionsAdapter.upsertMany(state, inspections);
}

export const slice = createSlice({
  name: 'inspections',
  initialState: inspectionsAdapter.getInitialState({
    entities: {},
    history: [],
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneInspectionById.fulfilled, upsertReducer);

    builder.addCase(getAllInspections.fulfilled, upsertReducer);

    builder.addCase(createOneInspection.fulfilled, upsertReducer);

    builder.addCase(updateOneInspection.fulfilled, (state, action) => {
      state.history.push(action);

      const { entities, id } = action.payload;
      const { inspections } = entities;
      inspectionsAdapter.updateOne(state, id, inspections[id]);
    });

    builder.addCase(deleteOneInspection.fulfilled, (state, action) => {
      state.history.push(action);

      inspectionsAdapter.removeOne(state, action.payload.id);
    });
  },
});

export default slice.reducer;
