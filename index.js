import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import Sentry from './src/config/sentry';
import App from './src/App';

if (Platform.OS === 'web') {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<App />);
} else {
  registerRootComponent(Sentry.Native.wrap(App));
}
