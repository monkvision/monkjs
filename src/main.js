import React from 'react';
import { render } from 'react-dom';
import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import App from 'components/App';
import './i18n';

import MonitoringProvider from '@monkvision/corejs/src/monitoring';

if (Platform.OS === 'web') {
  const container = document.getElementById('root');
  render(<MonitoringProvider><App /></MonitoringProvider>, container);
} else {
  registerRootComponent(Sentry.Native.wrap(App));
}
