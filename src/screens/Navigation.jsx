import React from 'react';
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import useAuth from 'hooks/useAuth';
import useLoading from 'hooks/useLoading';

import Header from 'components/Header';

import Loading from 'screens/Loading';
import Outed from 'screens/Authentication/Outed';
import Authentication from 'screens/Authentication';
import Dashboard from 'screens/Dashboard';
import Inspections from 'screens/Inspections';
import DamageLibrary from 'screens/Inspections/DamageLibrary';
import Profile from 'screens/Profile';
import Settings from 'screens/Settings';

const Drawer = createDrawerNavigator();
const prefix = Linking.createURL('/');

const linking = {
  prefixes: ['https://monk.ai', prefix],
};

export default function Navigation() {
  const isLoading = useLoading();
  const { isAuthenticated, isSignedOut } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (isSignedOut) {
    return <Outed />;
  }

  if (isAuthenticated !== true) {
    return <Authentication />;
  }

  return (
    <NavigationContainer linking={linking} fallback={<Loading />}>
      <Drawer.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          header: (props) => (
            <Header {...props} />
          ),
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          component={Dashboard}
        />

        <Drawer.Screen
          name="Inspections"
          component={Inspections}
          options={{
            headerShown: false,
          }}
        />

        <Drawer.Screen
          name="Damage Library"
          component={DamageLibrary}
          options={{
            headerShown: false,
          }}
        />

        <Drawer.Screen
          name="Profile"
          component={Profile}
        />

        <Drawer.Screen
          name="Settings"
          component={Settings}
        />

      </Drawer.Navigator>
    </NavigationContainer>
  );
}
