import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import config from '../config';

import * as api from './imagesApi';
import { entity } from './imagesEntity';

export const imagesAdapter = createEntityAdapter();

export const createOneImage = createAsyncThunk(
  'images/createOne',
  async (arg, { getState }) => {
    const { data } = await api.createOne(config(arg, getState));
    return normalize(data, entity);
  },
);

const handlePending = (state) => { state.loading = 'pending'; };
const handleRejected = (state) => { state.loading = 'idle'; };
const handleFulfilled = (state, action) => {
  state.loading = 'idle';
  state.freshlyCreated = action.payload.result;
  imagesAdapter.upsertMany(state, action.payload.entities.images);
};

export const slice = createSlice({
  name: 'images',
  initialState: imagesAdapter.getInitialState({
    loading: 'idle',
    freshlyCreated: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    // createOneImage
    builder.addCase(createOneImage.pending, handlePending);
    builder.addCase(createOneImage.rejected, handleRejected);
    builder.addCase(createOneImage.fulfilled, handleFulfilled);
  },
});

export default slice.reducer;
