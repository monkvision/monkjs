import React from 'react';
import Loading from 'components/Loading';

import store from 'store';
import { Provider } from 'react-redux';

import { useIcons } from '@monkvision/react-native';
import { theme } from '@monkvision/react-native-views';
import { Provider as PaperProvider } from 'react-native-paper';

import Navigation from 'Navigation';

export default function App() {
  const isLoading = useIcons();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </Provider>
  );
}
