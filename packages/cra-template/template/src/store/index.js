import { configureStore } from '@reduxjs/toolkit';

import permissions from './slices/permissions';

export default configureStore({
  reducer: {
    permissions,
  },
});
