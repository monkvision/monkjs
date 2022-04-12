import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as Screens from 'screens';
import * as names from 'screens/names';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={names.LANDING} screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name={names.LANDING}
          component={Screens.Landing}
          title="Monk Capture App"
        />
        <Stack.Screen
          name={names.INSPECTION_CAPTURE}
          component={Screens.InspectionCapture}
          title="Monk - Inspection Capture"
        />
        <Stack.Screen
          name={names.INSPECTION_CREATE}
          component={Screens.InspectionCreate}
          title="Monk - Inspection Create"
        />
        <Stack.Screen
          name={names.INSPECTION_LIST}
          component={Screens.InspectionList}
          title="Monk - Inspection List"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
