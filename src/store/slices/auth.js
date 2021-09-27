import { createSlice } from '@reduxjs/toolkit';
import createReducers from 'store/createReducers';
import Constants from 'expo-constants';

const customAccessToken = process.env.NODE_ENV === 'development'
  ? Constants.manifest.extra.CUSTOM_ACCESS_TOKEN
  : false;

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

export default authSlice.reducer;
