import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';

import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';

import { store } from 'Controllers';

import Loader from 'Components/Loader';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    height: 100,
    width: 100,
  },
});

export default function App() {
  const [isLoading, setLoading] = useState(false);

  function handlePress() {
    setLoading((prevState) => !prevState);
  }

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={store.getState().theme}>
        <View style={styles.container}>
          <Pressable onPress={handlePress}>
            <Loader
              isLoading={isLoading}
              style={styles.loader}
            />
          </Pressable>
          <Text style={{ marginTop: 16 }}>
            Welcome to Monk Software Development Kit!
          </Text>
          <StatusBar />
        </View>
      </PaperProvider>
    </StoreProvider>
  );
}
