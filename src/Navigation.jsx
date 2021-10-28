import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import useAuth from 'hooks/useAuth';
import useLoading from 'hooks/useLoading';

import * as Screens from 'screens';
import * as names from 'screens/names';

import Loading from 'components/Loading';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const isLoading = useLoading();
  // const { isAuthenticated, isSignedOut } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  // if (isSignedOut) {
  //   return <Screens.Outed />;
  // }
  //
  // if (isAuthenticated !== true) {
  //   return <Screens.Authentication />;
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={names.INSPECTION_CREATE}>

        <Stack.Screen
          name={names.GET_START}
          component={Screens.GetStart}
        />

        <Stack.Screen
          name={names.INSPECTIONS}
          component={Screens.Inspections}
        />

        <Stack.Screen
          name={names.INSPECTION_CREATE}
          component={Screens.InspectionCreate}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={names.INSPECTION_REVIEW}
          component={Screens.InspectionReview}
        />

        <Stack.Screen
          name={names.INSPECTION_READ}
          component={Screens.InspectionRead}
        />

        <Stack.Screen
          name={names.INSPECTION_UPDATE}
          component={Screens.InspectionUpdate}
        />

        <Stack.Screen
          name={names.DAMAGES}
          component={Screens.Damages}
        />

        <Stack.Screen
          name={names.DAMAGE_CREATE}
          component={Screens.DamageCreate}
        />

        <Stack.Screen
          name={names.DAMAGE_READ}
          component={Screens.DamageRead}
        />

        <Stack.Screen
          name={names.DAMAGE_UPDATE}
          component={Screens.DamageUpdate}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
