import React from 'react';
import { render } from 'react-dom';
import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import { name, version } from '@package/json';
import App from 'components/App';
import './i18n';
import { MonitoringProvider } from '@monkvision/corejs';

const config = {
  dsn: Constants.manifest.extra.SENTRY_DSN,
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  tracesSampleRate: 0.025,
  release: `${name}@${version}`,
  tracingOrigins: ['localhost', 'cna.dev.monk.ai', 'cna-staging.dev.monk.ai', 'cna.preview.monk.ai', 'cna.monk.ai'],
};

if (Platform.OS === 'web') {
  const container = document.getElementById('root');
  render(<MonitoringProvider config={config}><App /></MonitoringProvider>, container);
} else {
  registerRootComponent(Sentry.Native.wrap(App));
}
