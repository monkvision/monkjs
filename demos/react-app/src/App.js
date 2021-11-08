/* App.jsx */

import React from 'react';
import { useIcons } from '@monkvision/react-native';
import { CameraView, theme } from '@monkvision/react-native-views';
import { Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  useIcons();

  return (
    <PaperProvider theme={theme}>
      <CameraView />
    </PaperProvider>
  );
}
