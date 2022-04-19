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
  loaderDotsColors: ['#3064F3', '#658BF3', '#A0B7F6', '#F4F6FE'],
  colors: {
    ...initialTheme.colors,
    primary: '#2B52BE',
    success: '#19A4B1',
    accent: '#FFB821',
    background: '#181829',
    gradient: '#21218f',
    surface: '#313240',
    text: '#fafafa',
    placeholder: '#dadada',
    disabled: '#bbbdbf',
    onSurface: '#1D1F30',
    notification: '#000000',
    boneColor: '#1D1F30',
    highlightBoneColor: '#51536A',
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
