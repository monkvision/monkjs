import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from 'store';

import { Auth0Provider } from '@auth0/auth0-react';
import { authConfig } from 'config/corejs';

import { BrowserRouter as Router } from 'react-router-dom';

import { SnackbarProvider } from 'notistack';

import '@fontsource/roboto';
import theme from 'config/theme';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import App from 'views/App';

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

ReactDOM.render(<Root />, document.getElementById('root'));
