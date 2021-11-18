import React from 'react';

import store from 'store';
import { Provider } from 'react-redux';

import { theme } from '@monkvision/react-native-views';
import { Provider as PaperProvider } from 'react-native-paper';

import Navigation from 'Navigation';

import 'config/corejs';

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </Provider>
  );
}
