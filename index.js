import React from 'react';
import { render } from 'react-dom';
import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import Sentry from './src/config/sentry';
import App from './src/App';

if (Platform.OS === 'web') {
  const container = document.getElementById('root');
  render(<App />, container);
} else {
  registerRootComponent(Sentry.Native.wrap(App));
}
