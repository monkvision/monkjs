import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { getEnvOrThrow, MonkThemeProvider } from '@monkvision/common';
import { AppRouter } from './components';
import './index.css';

ReactDOM.render(
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
  </Auth0Provider>,
  document.getElementById('root'),
);
