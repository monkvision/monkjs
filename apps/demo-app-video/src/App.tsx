import { AnalyticsProvider } from '@monkvision/analytics';
import { getEnvOrThrow } from '@monkvision/common';
import { MonitoringProvider } from '@monkvision/monitoring';
import { Auth0Provider } from '@auth0/auth0-react';
import { AppRouter } from './components';
import { posthogAnalyticsAdapter } from './posthog';
import { sentryMonitoringAdapter } from './sentry';

function App() {
  return (
    <MonitoringProvider adapter={sentryMonitoringAdapter}>
      <AnalyticsProvider adapter={posthogAnalyticsAdapter}>
        <Auth0Provider
          domain={getEnvOrThrow('VITE_AUTH_DOMAIN')}
          clientId={getEnvOrThrow('VITE_AUTH_CLIENT_ID')}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: getEnvOrThrow('VITE_AUTH_AUDIENCE'),
            prompt: 'login',
          }}
        >
          <AppRouter />
        </Auth0Provider>
      </AnalyticsProvider>
    </MonitoringProvider>
  );
}

export default App;
