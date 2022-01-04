import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import {
  damages, images, inspections,
  parts, tasks, vehicles,
  users, views,
} from '@monkvision/corejs';

const devTools = process.env.NODE_ENV !== 'production';

const store = configureStore({
  devTools,
  reducer: {
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
