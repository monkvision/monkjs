import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import * as api from './usersApi';
import { entity } from './usersEntity';

export const usersAdapter = createEntityAdapter();

export const getUserInfo = createAsyncThunk(
  'users/getOne',
  async (arg) => {
    const { data } = await api.getOne({ ...arg });
    return normalize(data, entity);
  },
);

export const updateUserInfo = createAsyncThunk(
  'users/updateOne',
  async (arg) => {
    const { data } = await api.updateOne({ ...arg });
    return { ...normalize(data, entity), ...arg };
  },
);

export const getUserSignature = createAsyncThunk(
  'users/getSignature',
  async (arg) => {
    const { data } = await api.getSignature({ ...arg });
    const signature = { signature: data };
    return normalize(signature, entity);
  },
);

export const setUserSignature = createAsyncThunk(
  'users/setSignature',
  async (arg) => {
    const { data } = await api.setSignature({ ...arg });
    return normalize(data, entity);
  },
);

export const deleteUserSignature = createAsyncThunk(
  'users/deleteSignature',
  async (arg) => {
    await api.deleteSignature({ ...arg });
    return arg;
  },
);

function upsertReducer(state, action) {
  state.history.push(action);

  const { users } = action.payload.entities;
  usersAdapter.upsertMany(state, users);
}

export const slice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    entities: {},
    history: [],
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.fulfilled, upsertReducer);

    builder.addCase(updateUserInfo.fulfilled, upsertReducer);

    builder.addCase(getUserSignature.fulfilled, upsertReducer);

    builder.addCase(setUserSignature.fulfilled, upsertReducer);

    builder.addCase(deleteUserSignature.fulfilled, (state, action) => {
      state.history.push(action);

      usersAdapter.removeOne(state, action.payload.id);
    });
  },
});

export default slice.reducer;
