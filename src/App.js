import React from 'react';
import store from 'store';
import { Provider } from 'react-redux';
import { useWindowDimensions, View, StyleSheet } from 'react-native';
import { theme as initialTheme, useIcons } from '@monkvision/toolkit';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

import Navigation from 'Navigation';
import 'config/corejs';

const theme = {
  ...DefaultTheme,
  ...initialTheme,
  dark: true,
  mode: 'adaptive',
  loaderDotsColors: ['#ffcc66', '#FFE2A9', '#FFEECB', '#fafafa'],
  colors: {
    ...initialTheme.colors,
    primary: '#648FF3',
    success: '#36b0c2',
    accent: '#ffcc66',
    background: '#202020',
    surface: '#303030',
    text: '#fafafa',
    placeholder: '#dadada',
    disabled: '#afafaf',
    onSurface: '#252525',
    notification: '#36b0c2',
  },
};

const styles = StyleSheet.create({
  layout: {
    backgroundColor: theme.colors.background,
  },
});

export default function App() {
  useIcons();
  const { height: minHeight } = useWindowDimensions();

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <View style={[styles.layout, { minHeight }]}>
          <Navigation />
        </View>
      </PaperProvider>
    </Provider>
  );
}
