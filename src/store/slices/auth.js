import mapKeys from 'lodash.mapkeys';
import camelCase from 'lodash.camelcase';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrate: (state, { payload }) => ({ ...payload }),
    logIn: (state, { payload }) => ({
      ...state,
      ...mapKeys(payload, (v, k) => camelCase(k)),
    }),
    reset: () => ({ ...initialState }),
  },
});

export const { hydrate, logIn, reset } = authSlice.actions;

export default authSlice.reducer;
