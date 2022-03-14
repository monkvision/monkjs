import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useAuth from 'hooks/useAuth';

import * as Screens from 'screens';
import * as names from 'screens/names';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { isAuthenticated, isSignedOut } = useAuth();

  if (isSignedOut) {
    return <Screens.Outed />;
  }

  if (isAuthenticated !== true) {
    return <Screens.Authentication />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={names.LANDING}>

        <Stack.Screen
          name={names.LANDING}
          component={Screens.Landing}
          title="Home"
        />

        <Stack.Screen
          name={names.INSPECTION_READ}
          component={Screens.InspectionRead}
          title="Inspection"
        />

        <Stack.Screen
          name={names.PROFILE}
          component={Screens.Profile}
          title="Profile"
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
