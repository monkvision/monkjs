import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from 'store';

import { Auth0Provider } from '@auth0/auth0-react';

import { BrowserRouter as Router } from 'react-router-dom';

import 'config/vars.css';
import '@fontsource/roboto';
import theme from 'config/theme';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import App from 'views/App';

// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Provider store={store}>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH_DOMAIN}
      clientId={process.env.REACT_APP_AUTH_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <Router>
        <ThemeProvider theme={createTheme(theme)}>
          <App />
        </ThemeProvider>
      </Router>
    </Auth0Provider>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
