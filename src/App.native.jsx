import React from 'react';

import store from 'store';
import { Provider, useSelector } from 'react-redux';

import theme from 'config/theme';
import { Provider as PaperProvider } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Authentication from 'components/Authentication';
import Test from 'components/Test';

const Stack = createNativeStackNavigator();

function Navigation() {
  const auth = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Authentication">
        {auth.accessToken ? (
          <>
            <Stack.Screen name="Test" component={Test} />
          </>
        ) : <Stack.Screen name="Authentication" component={Authentication} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </Provider>
  );
}
