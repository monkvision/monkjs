import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from 'store';

import { Auth0Provider } from '@auth0/auth0-react';
import { authConfig } from 'config/corejs';

import { BrowserRouter as Router } from 'react-router-dom';

import 'config/vars.css';
import '@fontsource/roboto';
import theme from 'config/theme';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import App from 'views/App';

// import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
    <Auth0Provider
      audience={authConfig.audience}
      clientId={authConfig.clientId}
      domain={authConfig.domain}
      redirectUri={`${window.origin}/login/callback`}
    >
      <Router>
        <ThemeProvider theme={createTheme(theme)}>
          <App />
        </ThemeProvider>
      </Router>
    </Auth0Provider>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
