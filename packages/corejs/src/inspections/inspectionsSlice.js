import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import * as api from './inspectionsApi';
import { entity } from './inspectionsEntity';

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
    return normalize(data, entity);
  },
);

export const createOneInspection = createAsyncThunk(
  'inspections/createOne',
  async (arg) => {
    const { data } = await api.createOne({ ...arg });
    return normalize(data, entity);
  },
);

const handlePending = (state) => {
  state.error = false;
  state.loading = 'pending';
};

const handleRejected = (state, action) => {
  state.loading = 'idle';
  state.error = action.error;
};

const handleFulfilled = (state, action) => {
  state.error = false;
  state.loading = 'idle';
  inspectionsAdapter.upsertMany(state, action.payload.entities.inspections);
};

export const slice = createSlice({
  name: 'inspections',
  initialState: inspectionsAdapter.getInitialState({
    error: false,
    loading: 'idle',
    freshlyCreated: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    // getOneInspectionById
    builder.addCase(getOneInspectionById.pending, handlePending);
    builder.addCase(getOneInspectionById.rejected, handleRejected);
    builder.addCase(getOneInspectionById.fulfilled, handleFulfilled);

    // getAllInspections
    builder.addCase(getAllInspections.pending, handlePending);
    builder.addCase(getAllInspections.rejected, handleRejected);
    builder.addCase(getAllInspections.fulfilled, handleFulfilled);

    // createOneInspection
    builder.addCase(createOneInspection.pending, handlePending);
    builder.addCase(createOneInspection.rejected, handleRejected);
    builder.addCase(createOneInspection.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.freshlyCreated = action.payload.result;
      inspectionsAdapter.upsertMany(state, action.payload.entities.inspections);
    });
  },
});

export default slice.reducer;
