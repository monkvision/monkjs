import { MonitoringProvider } from '@monkvision/corejs';
import { name, version } from '@package/json';
import App from 'components/App';
import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import './i18n';

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
  const root = createRoot(container);
  root.render(<MonitoringProvider config={config}><App /></MonitoringProvider>);
} else {
  registerRootComponent(Sentry.Native.wrap(App));
}
