import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import logger from 'redux-logger';

import inspectionApi from './services/inspection';

import auth from './slices/auth';

const middlewares = [inspectionApi.middleware];

const devTools = process.env.NODE_ENV !== 'production';

if (devTools) {
  middlewares.push(logger);
}

const store = configureStore({
  devTools,
  middleware: (getMiddleware) => getMiddleware().concat(middlewares),
  reducer: {
    auth,
    [inspectionApi.reducerPath]: inspectionApi.reducer,
  },
});

setupListeners(store.dispatch);

export default store;
