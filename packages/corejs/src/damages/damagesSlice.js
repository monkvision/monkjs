import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';
import { getOneInspectionById } from '../asyncThunks';

import * as api from './damagesInsApi';
import { entity } from './damagesEntity';

export const damagesAdapter = createEntityAdapter();

function upsertReducer(state, action) {
  const { damages } = action.payload.entities;
  if (damages) {
    damagesAdapter.upsertMany(state, damages);
  }
}

export const createOneDamage = createAsyncThunk(
  'damages/createOne',
  async (arg) => {
    const { data } = await api.createOne({ ...arg });
    return normalize(data, entity);
  },
);

export const deleteOneDamage = createAsyncThunk(
  'damages/deleteOne',
  async (arg) => {
    await api.deleteOne({ ...arg });
    return arg;
  },
);

export const slice = createSlice({
  name: 'damages',
  initialState: damagesAdapter.getInitialState({
    entities: {},
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneInspectionById.fulfilled, upsertReducer);

    builder.addCase(createOneDamage.fulfilled, upsertReducer);

    builder.addCase(deleteOneDamage.fulfilled, (state, action) => {
      damagesAdapter.removeOne(state, action.payload.id);
    });
  },
});

export default slice.reducer;
