import React from 'react';
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useAuth from 'hooks/useAuth';
import useMinLoadingTime from 'hooks/useMinLoadingTime';

import Loading from 'components/Loading';

import Home from 'components/Home';

import Authentication from 'components/Authentication';
import Outed from 'components/Authentication/Outed';

const Stack = createNativeStackNavigator();
const prefix = Linking.createURL('/');

const linking = {
  prefixes: ['https://monk.ai', prefix],
};

export default function Navigation() {
  const { isAuthenticated, isLoading: isAuthenticating, isSignedOut } = useAuth();
  const isLoading = useMinLoadingTime(isAuthenticating);

  if (isLoading) {
    return <Loading />;
  }

  if (isSignedOut) {
    return <Outed />;
  }

  return (
    <NavigationContainer linking={linking} fallback={<Loading />}>
      <Stack.Navigator initialRouteName="home">
        {!isAuthenticated && (
          <Stack.Screen
            name="authentication"
            component={Authentication}
            options={{
              title: 'Authenticate',
              // When logging out, a pop animation feels intuitive
              // You can remove this if you want the default 'push' animation
              animationTypeForReplace: isSignedOut ? 'pop' : 'push',
            }}
          />
        )}
        {isAuthenticated && (
          <Stack.Screen
            name="home"
            component={Home}
            options={{
              title: 'Dashboard',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
