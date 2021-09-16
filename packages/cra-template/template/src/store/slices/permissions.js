import { createSlice } from '@reduxjs/toolkit';

export const securitySlice = createSlice({
  name: 'permissions',
  initialState: {
    hasAcceptedTerms: false,
  },
  reducers: {
    acceptTerms: (state) => {
      state.hasAcceptedTerms = true;
    },
  },
});

export const { acceptTerms } = securitySlice.actions;

export default securitySlice.reducer;
