import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import * as api from './inspectionsApi';
import { entity, entityCollection } from './inspectionsEntity';

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
    return normalize(data, entity);
  },
);

export const deleteOneInspection = createAsyncThunk(
  'inspections/deleteOne',
  async (arg) => {
    await api.deleteOne({ ...arg });
    return arg;
  },
);

export const slice = createSlice({
  name: 'inspections',
  initialState: inspectionsAdapter.getInitialState({
    entities: {},
    history: [],
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneInspectionById.fulfilled, (state, action) => {
      state.history.push(action);

      const { entities, result } = action.payload;
      if (result?.paging) { state.paging = result.paging; }

      inspectionsAdapter.upsertMany(state, entities.inspections);
    });

    builder.addCase(getAllInspections.fulfilled, (state, action) => {
      state.history.push(action);

      const { entities, result } = action.payload;
      if (result?.paging) { state.paging = result.paging; }

      inspectionsAdapter.setAll(state, entities.inspections);
    });

    builder.addCase(createOneInspection.fulfilled, (state, action) => {
      state.history.push(action);

      const { entities, result } = action.payload;
      state.freshlyCreated = result;
      inspectionsAdapter.upsertMany(state, entities.inspections);
    });

    builder.addCase(updateOneInspection.fulfilled, (state, action) => {
      state.history.push(action);

      const { entities, result } = action.payload;
      state.freshlyCreated = result;
      inspectionsAdapter.upsertMany(state, entities.inspections);
    });

    builder.addCase(deleteOneInspection.fulfilled, (state, action) => {
      state.history.push(action);

      inspectionsAdapter.removeOne(state, action.payload.id);
    });
  },
});

export default slice.reducer;
