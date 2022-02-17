import React from 'react';

import store from 'store';
import { Provider } from 'react-redux';

import { useIcons, theme as initialTheme } from '@monkvision/toolkit';

import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import Navigation from 'Navigation';

import 'config/corejs';

const theme = {
  ...DefaultTheme,
  ...initialTheme,
  colors: { ...DefaultTheme.colors, ...initialTheme.colors },
};

export default function App() {
  useIcons();

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </Provider>
  );
}
