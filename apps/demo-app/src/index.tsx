import { createRoot } from 'react-dom/client';
import { MonitoringProvider } from '@monkvision/monitoring';
import { AnalyticsProvider } from '@monkvision/analytics';
import { Auth0Provider } from '@auth0/auth0-react';
import { getEnvOrThrow } from '@monkvision/common';
import { sentryMonitoringAdapter } from './sentry';
import { posthogAnalyticsAdapter } from './posthog';
import { AppRouter } from './components';
import './index.css';
import './i18n';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <MonitoringProvider adapter={sentryMonitoringAdapter}>
    <AnalyticsProvider adapter={posthogAnalyticsAdapter}>
      <Auth0Provider
        domain={getEnvOrThrow('REACT_APP_AUTH_DOMAIN')}
        clientId={getEnvOrThrow('REACT_APP_AUTH_CLIENT_ID')}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: getEnvOrThrow('REACT_APP_AUTH_AUDIENCE'),
          prompt: 'login',
        }}
      >
        <AppRouter />
      </Auth0Provider>
    </AnalyticsProvider>
  </MonitoringProvider>,
);
