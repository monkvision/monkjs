import React from 'react';

import store from 'store';
import { Provider } from 'react-redux';

import { useIcons } from '@monkvision/react-native';
import { theme } from '@monkvision/react-native-views';
import { Provider as PaperProvider } from 'react-native-paper';

import InspectionsCreate from 'screens/Inspections/Create';

export default function App() {
  useIcons();

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <InspectionsCreate />
      </PaperProvider>
    </Provider>
  );
}
