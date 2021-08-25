import { createSlice } from '@reduxjs/toolkit';
import { DefaultTheme } from 'react-native-paper';

const monkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#274b9f',
    accent: '#26b7a3',
  },
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState: monkTheme,
  reducers: {
    setTheme: (state, payload) => {
      state = payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
