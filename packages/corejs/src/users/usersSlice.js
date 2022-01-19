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
    const { id } = arg;
    const { data } = await api.getSignature({ ...arg });
    const signature = {
      signature: data,
      id,
    };
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
    const { id } = arg;
    await api.deleteSignature({ ...arg });
    return normalize(id, entity);
  },
);

export const slice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    entities: {},
    history: [],
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      usersAdapter.upsertOne(state, action.payload);
    });

    builder.addCase(updateUserInfo.fulfilled, (state, action) => {
      usersAdapter.upsertOne(state, action.payload);
    });

    builder.addCase(getUserSignature.fulfilled, (state, action) => {
      usersAdapter.upsertOne(state, action.payload);
    });

    builder.addCase(deleteUserSignature.fulfilled, (state, action) => {
      usersAdapter.upsertOne(state, {
        id: action.payload.id,
        signature: '',
      });
    });
  },
});

export default slice.reducer;
