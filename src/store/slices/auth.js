import { createSlice } from '@reduxjs/toolkit';
import createReducers from 'store/createReducers';

const initialState = {
  isLoading: false,
  isSignedOut: false,
  accessToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: createReducers(initialState),
});

export default authSlice.reducer;
