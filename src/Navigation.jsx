import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useAuth from 'hooks/useAuth';
import useLoading from 'hooks/useLoading';

import * as Screens from 'screens';
import * as names from 'screens/names';

import Loading from 'components/Loading';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const isLoading = useLoading();
  const { isAuthenticated, isSignedOut } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

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
          name={names.GETTING_STARTED}
          component={Screens.GettingStarted}
          title="Getting Started"
        />

        <Stack.Screen
          name={names.LANDING}
          component={Screens.Landing}
          title="Home"
        />

        <Stack.Screen
          name={names.INSPECTIONS}
          component={Screens.Inspections}
          title="Inspections"
        />

        <Stack.Screen
          name={names.INSPECTION_CREATE}
          component={Screens.InspectionCreate}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={names.INSPECTION_REVIEW}
          component={Screens.InspectionReview}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={names.INSPECTION_READ}
          component={Screens.InspectionRead}
          title="Inspection"
        />

        <Stack.Screen
          name={names.INSPECTION_UPDATE}
          component={Screens.InspectionUpdate}
          title="Update inspection"
        />

        <Stack.Screen
          name={names.DAMAGES}
          component={Screens.Damages}
          title="Damaged parts"
        />

        <Stack.Screen
          name={names.DAMAGE_CREATE}
          component={Screens.DamageCreate}
          title="New damage"
        />

        <Stack.Screen
          name={names.DAMAGE_READ}
          component={Screens.DamageRead}
          title="Damage"
        />

        <Stack.Screen
          name={names.DAMAGE_UPDATE}
          component={Screens.DamageUpdate}
          title="Update damage"
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
