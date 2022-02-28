import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Loader } from '@monkvision/ui';

import useAuth from 'hooks/useAuth';
import useLoading from 'hooks/useLoading';

import * as Screens from 'screens';
import * as names from 'screens/names';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const isLoading = useLoading();
  const { isAuthenticated, isSignedOut } = useAuth();

  if (isLoading) {
    return <Loader texts={['Redistributing your screens...', 'Cleaning all screens with a glass cleaner...', 'Loading...']} />;
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
          name={names.INSPECTION_VIN}
          component={Screens.InspectionVin}
          title="Vehicle id number"
        />

        <Stack.Screen
          name={names.INSPECTION_CREATE}
          component={Screens.InspectionCreate}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={names.INSPECTION_IMPORT}
          component={Screens.InspectionImport}
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
          name={names.PROFILE}
          component={Screens.Profile}
          title="Profile"
        />

        <Stack.Screen
          name={names.TASK_READ}
          component={Screens.TaskRead}
          title="Task read"
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
