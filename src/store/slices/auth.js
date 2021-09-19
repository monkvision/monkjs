import { createSlice } from '@reduxjs/toolkit';
import createReducers from 'store/createReducers';

const initialState = {};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: createReducers(initialState),
});

export default authSlice.reducer;
