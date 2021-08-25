import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';

import { store } from 'Controllers';

import Logo from 'Components/Logo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={store.getState().theme}>
        <View style={styles.container}>
          <Logo height={100} width={100} />
          <Text style={{ marginTop: 16 }}>
            Welcome to Monk Software Development Kit!
          </Text>
          <StatusBar />
        </View>
      </PaperProvider>
    </StoreProvider>
  );
}
