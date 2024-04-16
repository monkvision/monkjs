import React from 'react';
import ReactDOM from 'react-dom';
// import { MonitoringProvider } from '@monkvision/monitoring';
// import { Auth0Provider } from '@auth0/auth0-react';
// import { getEnvOrThrow, MonkThemeProvider } from '@monkvision/common';
// import { sentryMonitoringAdapter } from './sentry';
// import { AppRouter } from './components';
import { Camera } from '@monkvision/camera-web';
import './index.css';
import './i18n';
import { DebugMonitoringAdapter, MonitoringProvider } from '@monkvision/monitoring';

function Test() {
  return (
    <MonitoringProvider adapter={new DebugMonitoringAdapter()}>
      <Camera />
    </MonitoringProvider>
  );
}

ReactDOM.render(
  <Test />,
  // <MonitoringProvider adapter={sentryMonitoringAdapter}>
  //   <Auth0Provider
  //     domain={getEnvOrThrow('REACT_APP_AUTH_DOMAIN')}
  //     clientId={getEnvOrThrow('REACT_APP_AUTH_CLIENT_ID')}
  //     authorizationParams={{
  //       redirect_uri: window.location.origin,
  //       audience: getEnvOrThrow('REACT_APP_AUTH_AUDIENCE'),
  //       prompt: 'login',
  //     }}
  //   >
  //     <MonkThemeProvider>
  //       <AppRouter />
  //     </MonkThemeProvider>
  //   </Auth0Provider>
  // </MonitoringProvider>,
  document.getElementById('root'),
);
