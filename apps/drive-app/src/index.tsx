import React from 'react';
import ReactDOM from 'react-dom';
import { DebugMonitoringAdapter, MonitoringProvider } from '@monkvision/monitoring';
import { AnalyticsProvider, EmptyAnalyticsAdapter } from '@monkvision/analytics';
import { Auth0Provider } from '@auth0/auth0-react';
import { getEnvOrThrow, MonkThemeProvider } from '@monkvision/common';
// import { sentryMonitoringAdapter } from './sentry';
// import { posthogAnalyticsAdapter } from './posthog';
import { AppRouter } from './components';
import './index.css';
import './i18n';

ReactDOM.render(
  <MonitoringProvider
    adapter={new DebugMonitoringAdapter({ showUnsupportedMethodWarnings: false })}
  >
    <AnalyticsProvider
      adapter={new EmptyAnalyticsAdapter({ showUnsupportedMethodWarnings: false })}
    >
      <Auth0Provider
        domain={getEnvOrThrow('REACT_APP_AUTH_DOMAIN')}
        clientId={getEnvOrThrow('REACT_APP_AUTH_CLIENT_ID')}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: getEnvOrThrow('REACT_APP_AUTH_AUDIENCE'),
          prompt: 'login',
        }}
      >
        <MonkThemeProvider>
          <AppRouter />
        </MonkThemeProvider>
      </Auth0Provider>
    </AnalyticsProvider>
  </MonitoringProvider>,
  document.getElementById('root'),
);
