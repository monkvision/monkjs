import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import { getAllInspections } from '../inspections/inspectionsSlice';

import * as api from './imagesApi';
import { entity } from './imagesEntity';

export const imagesAdapter = createEntityAdapter();

export const addOneImageToInspection = createAsyncThunk(
  'images/createOne',
  async (arg) => {
    const { data } = await api.addOne({ ...arg });
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
  state.freshlyCreated = action.payload.result;
  imagesAdapter.upsertMany(state, action.payload.entities.images);
};

export const slice = createSlice({
  name: 'images',
  initialState: imagesAdapter.getInitialState({
    error: false,
    loading: 'idle',
    freshlyCreated: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    // addOneImageToInspection
    builder.addCase(addOneImageToInspection.pending, handlePending);
    builder.addCase(addOneImageToInspection.rejected, handleRejected);
    builder.addCase(addOneImageToInspection.fulfilled, handleFulfilled);
    builder.addCase(getAllInspections.fulfilled, ((state, action) => {
      if (action?.payload?.entities?.images) {
        imagesAdapter.upsertMany(state, action.payload.entities.images);
      }
    }));
  },
});

export default slice.reducer;
