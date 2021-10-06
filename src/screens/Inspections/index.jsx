import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Header from 'components/Header';

import InspectionsHome from 'screens/Inspections/Home';
import InspectionsCreate from 'screens/Inspections/Create';
import Tutorial from 'screens/Inspections/Tutorial';

const Stack = createNativeStackNavigator();

export default function Inspections() {
  return (
    <Stack.Navigator
      initialRouteName="InspectionsHome"
      screenOptions={{
        header: (props) => (
          <Header {...props} />
        ),
      }}
    >
      <Stack.Screen
        name="InspectionsHome"
        component={InspectionsHome}
        options={{
          title: 'Inspections',
          children: <InspectionsHome.RightActions />,
        }}
      />
      <Stack.Screen
        name="InspectionsCreate"
        component={InspectionsCreate}
        options={{
          title: 'New inspection',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="InspectionsTutorial"
        component={Tutorial}
        options={{
          title: 'Inspection tutorial',
        }}
      />
    </Stack.Navigator>
  );
}
