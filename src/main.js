import { MonitoringProvider } from '@monkvision/corejs';
import App from 'components/App';
import { registerRootComponent } from 'expo';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import { ClientProvider, useClient } from './contexts/clients';
import './i18n';
import ClientMonitoring from './contexts/clients/monitoring';

function SentryWrapper() {
  const { client } = useClient();

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ client:', client);
    console.log('🚀 ~ useEffect ~ ClientMonitoring[client]:', ClientMonitoring[client]);
  }, [client]);

  return (
    <MonitoringProvider config={ClientMonitoring[client]}>
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
