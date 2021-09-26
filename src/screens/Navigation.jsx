import React from 'react';
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import useAuth from 'hooks/useAuth';
import { useFonts } from 'expo-font';
import useMinLoadingTime from 'hooks/useMinLoadingTime';

import Header from 'components/Header';

import Loading from 'screens/Loading';
import Outed from 'screens/Authentication/Outed';
import Authentication from 'screens/Authentication';
import Dashboard from 'screens/Dashboard';
import Inspections from 'screens/Inspections';
import Profile from 'screens/Profile';
import Settings from 'screens/Settings';

import MaterialCommunityIcons from '@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';

const Drawer = createDrawerNavigator();
const prefix = Linking.createURL('/');

const linking = {
  prefixes: ['https://monk.ai', prefix],
};

export default function Navigation() {
  const { isAuthenticated, isLoading: isAuthenticating, isSignedOut } = useAuth();
  const [fontsLoaded] = useFonts({
    MaterialCommunityIcons,
    'Material Design Icons': MaterialCommunityIcons,
  });

  const isLoading = useMinLoadingTime(isAuthenticating || !fontsLoaded);

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
