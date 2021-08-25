import { configureStore } from '@reduxjs/toolkit';
import theme from 'Controllers/slices/theme';

// eslint-disable-next-line import/prefer-default-export
export const store = configureStore({
  reducer: {
    theme,
  },
});
