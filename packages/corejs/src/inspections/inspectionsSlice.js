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

  const { entities, result } = action.payload;
  if (result?.paging) { state.paging = result.paging; }

  inspectionsAdapter.upsertMany(state, entities.inspections);
};

export const slice = createSlice({
  name: 'inspections',
  initialState: inspectionsAdapter.getInitialState({
    error: false,
    loading: 'idle',
    freshlyCreated: null,
    paging: null,
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
    builder.addCase(getAllInspections.fulfilled, (state, action) => {
      state.error = false;
      state.loading = 'idle';

      const { entities, result } = action.payload;
      if (result?.paging) { state.paging = result.paging; }

      inspectionsAdapter.setAll(state, entities.inspections);
    });

    // createOneInspection
    builder.addCase(createOneInspection.pending, handlePending);
    builder.addCase(createOneInspection.rejected, handleRejected);
    builder.addCase(createOneInspection.fulfilled, (state, action) => {
      state.loading = 'idle';
      const { entities, result } = action.payload;
      state.freshlyCreated = result;
      inspectionsAdapter.upsertMany(state, entities.inspections);
    });

    // updateOneInspection
    builder.addCase(updateOneInspection.pending, handlePending);
    builder.addCase(updateOneInspection.rejected, handleRejected);
    builder.addCase(updateOneInspection.fulfilled, (state, action) => {
      state.loading = 'idle';
      const { entities, result } = action.payload;
      state.freshlyCreated = result;
      inspectionsAdapter.upsertMany(state, entities.inspections);
    });

    // deleteOneInspection
    builder.addCase(deleteOneInspection.pending, handlePending);
    builder.addCase(deleteOneInspection.rejected, handleRejected);
    builder.addCase(deleteOneInspection.fulfilled, (state, action) => {
      state.loading = 'idle';
      inspectionsAdapter.removeOne(state, action.payload.id);
    });
  },
});

export default slice.reducer;
