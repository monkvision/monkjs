/* eslint-disable global-require */
import React, { useState, useEffect, useCallback } from 'react';
import store from 'store';
import { Provider } from 'react-redux';
import { useWindowDimensions, View, StyleSheet } from 'react-native';
import { theme as initialTheme } from '@monkvision/toolkit';
import { Loader } from '@monkvision/ui';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import * as Font from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';

import Navigation from 'config/Navigation';
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

const customFonts = {
  MaterialCommunityIcons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
  'Material Design Icons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
};

export default function App() {
  const { height: minHeight } = useWindowDimensions();

  const [appIsReady, setAppIsReady] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Preload fonts, make any API calls you need to do here
        await Font.loadAsync(customFonts);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => { setTimeout(resolve, 2000); });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return (
      <View style={[styles.layout, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Loader texts={['Launching the App...']} />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <View style={[styles.layout, { minHeight }]} onLayout={onLayoutRootView}>
          <Navigation />
        </View>
      </PaperProvider>
    </Provider>
  );
}
