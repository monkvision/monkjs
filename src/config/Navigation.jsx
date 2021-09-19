import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useAuth from 'hooks/useAuth';
import useMinLoadingTime from 'hooks/useMinLoadingTime';

import Loading from 'components/Loading';
import Authentication from 'components/Authentication';

import Home from 'components/Home';
import Test from 'components/Test';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { isAuthenticated, isLoading: authenticating } = useAuth();
  const isLoading = useMinLoadingTime(authenticating);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Test" component={Test} />
          </>
        ) : <Stack.Screen name="Authentication" component={Authentication} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
