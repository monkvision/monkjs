import { inspections } from '@monkvision/corejs';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import auth from './slices/auth';

const devTools = process.env.NODE_ENV !== 'production';

const store = configureStore({
  devTools,
  reducer: {
    auth,
    inspections,
  },
});

setupListeners(store.dispatch);

export default store;
export * from './slices/auth';
