import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import store from 'store';
import { Auth0Provider } from '@auth0/auth0-react';

import { authConfig } from 'config/corejs';
import { BrowserRouter as Router } from 'react-router-dom';

import { SnackbarProvider } from 'notistack';

import '@fontsource/roboto';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import theme from 'config/theme';

import App from 'views/App';

import reportWebVitals from './reportWebVitals';
import './i18n';

function Root() {
  return (
    <Provider store={store}>
      <Auth0Provider
        audience={authConfig.audience}
        clientId={authConfig.clientId}
        domain={authConfig.domain}
        redirectUri={`${window.origin}`}
      >
        <Router>
          <ThemeProvider theme={createTheme(theme)}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <App />
            </SnackbarProvider>
          </ThemeProvider>
        </Router>
      </Auth0Provider>
    </Provider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);

reportWebVitals();
