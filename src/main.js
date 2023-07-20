import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import App from 'components/App';
import './i18n';
import { MonitoringProvider } from '@monkvision/corejs';
import { ClientProvider, useClient } from './contexts/clients';
import ClientMonitoring from './contexts/clients/monitoring';

function SentryWrapper() {
  const { client } = useClient();

  return (
    <MonitoringProvider config={ClientMonitoring[client] ?? {}}>
      <App />
    </MonitoringProvider>
  );
}

if (Platform.OS === 'web') {
  const container = document.getElementById('root');
  render(
    <ClientProvider>
      <SentryWrapper />
    </ClientProvider>,
    container,
  );
} else {
  registerRootComponent(Sentry.Native.wrap(App));
}
