import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import monkCore from 'config/monkCore';
import logger from 'redux-logger';

import auth from './slices/auth';

const middlewares = [monkCore.inspection.middleware];

const devTools = process.env.NODE_ENV !== 'production';

if (devTools) {
  middlewares.push(logger);
}

const store = configureStore({
  devTools,
  middleware: (getMiddleware) => getMiddleware().concat(middlewares),
  reducer: {
    auth,
    [monkCore.inspection.reducerPath]: monkCore.inspection.reducer,
  },
});

setupListeners(store.dispatch);

export default store;
