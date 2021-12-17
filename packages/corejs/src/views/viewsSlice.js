import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import * as api from './viewsApi';
import { entity } from './viewsEntity';

export const viewsAdapter = createEntityAdapter();

export const addOneViewToInspection = createAsyncThunk(
  'views/createOne',
  async (arg) => {
    const { data } = await api.addOne({ ...arg });
    return normalize(data, entity);
  },
);

export const deleteOneView = createAsyncThunk(
  'views/deleteOne',
  async (arg) => {
    await api.deleteOne({ ...arg });
    return arg;
  },
);

function upsertReducer(state, action) {
  const { views } = action.payload.entities;
  if (views) {
    viewsAdapter.upsertMany(state, views);
  }
}

export const slice = createSlice({
  name: 'views',
  initialState: viewsAdapter.getInitialState({
    entities: {},
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addOneViewToInspection.fulfilled, upsertReducer);

    builder.addCase(deleteOneView.fulfilled, (state, action) => {
      viewsAdapter.removeOne(state, action.payload.id);
    });
  },
});

export default slice.reducer;
