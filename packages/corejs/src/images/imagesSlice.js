import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import { getOneInspectionById, getAllInspections } from '../asyncThunks';

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

function upsertReducer(state, action) {
  const { images } = action.payload.entities;
  imagesAdapter.upsertMany(state, images);
}

function upsertIfExistReducer(state, action) {
  const images = action?.payload?.entities?.images;
  if (images) { imagesAdapter.upsertMany(state, images); }
}

export const slice = createSlice({
  name: 'images',
  initialState: imagesAdapter.getInitialState({
    entities: {},
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addOneImageToInspection.fulfilled, upsertReducer);

    builder.addCase(getOneInspectionById.fulfilled, upsertIfExistReducer);

    builder.addCase(getAllInspections.fulfilled, upsertIfExistReducer);
  },
});

export default slice.reducer;
