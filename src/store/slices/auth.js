import { createSlice } from '@reduxjs/toolkit';
import Constants from 'expo-constants';
import createReducers from 'store/createReducers';

const customAccessToken = process.env.NODE_ENV === 'development' ? Constants.manifest.extra.CUSTOM_ACCESS_TOKEN : false;

const initialState = {
  accessToken: customAccessToken || null,
  isAuthenticated: Boolean(customAccessToken),
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
