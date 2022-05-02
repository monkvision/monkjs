import monk from '@monkvision/corejs';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import logger from 'redux-logger';

const devTools = process.env.NODE_ENV !== 'production';

const rootReducer = combineReducers({ ...monk.reducers });

const store = configureStore({
  devTools,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware();

    if (devTools) {
      middleware.push(logger);
    }

    return middleware;
  },
});

export default store;
