import { configureStore } from '@reduxjs/toolkit';

import auth from './slices/auth';

export default configureStore({
  reducer: {
    auth,
  },
});
