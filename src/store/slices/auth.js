import { createSlice } from '@reduxjs/toolkit';
import createReducers from 'store/createReducers';

const initialState = {
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isSignedOut: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: createReducers(initialState),
});

export const { reset, set, update } = authSlice.actions;
export default authSlice.reducer;
