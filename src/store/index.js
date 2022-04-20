import {
  damages,
  images,
  inspections,
  parts,
  tasks,
  users,
  vehicles,
  views,
} from '@monkvision/corejs';
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import auth from './slices/auth';

const devTools = process.env.NODE_ENV === 'production';

const store = configureStore({
  devTools,
  reducer: {
    auth,
    images,
    inspections,
    tasks,
    damages,
    parts,
    vehicles,
    users,
    views,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware();

    if (devTools) {
      middleware.push(logger);
    }

    return middleware;
  },
});

export default store;
export * from './slices/auth';
