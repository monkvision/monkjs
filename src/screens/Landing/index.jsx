import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useLayoutEffect } from 'react';

import { GETTING_STARTED, INSPECTIONS } from 'screens/names';
import { spacing } from 'config/theme';

import { useNavigation } from '@react-navigation/native';
import { useMediaQuery } from 'react-responsive';
import useAuth from 'hooks/useAuth';

import MonkIcon from 'components/Icons/MonkIcon';
import Drawing from 'components/Drawing';
import { Appbar, Button, Text, useTheme } from 'react-native-paper';
import { StyleSheet, Platform, SafeAreaView, View } from 'react-native';

import logo from 'assets/logo-white.svg';
import drawing from './drawing.svg';

const styles = StyleSheet.create({
  root: {
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flexGrow: 1, minHeight: 'calc(100vh - 56px)' },
    }),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    margin: spacing(2),
  },
  logo: {
    marginLeft: spacing(2),
  },
  primaryButton: {
    margin: spacing(2),
  },
});

export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { signOut } = useAuth();
  const isMediumSize = useMediaQuery({ maxDeviceWidth: 1224 });

  const handleSignOut = useCallback(signOut, [signOut]);
  const handleStart = useCallback(() => navigation.navigate(GETTING_STARTED), [navigation]);
  const goToInspections = useCallback(() => navigation.navigate(INSPECTIONS), [navigation]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        header: () => (
          <Appbar.Header>
            {isMediumSize ? (
              <Drawing xml={logo} height={44} width={44} alt="logo" />
            ) : (
              <MonkIcon
                color={colors.primaryContrastText}
                width={100}
                height={44}
                alt="logo"
                style={styles.logo}
              />
            )}
            {!isMediumSize && (
              <Appbar.Content
                title="Vehicle Damage Detection"
                subtitle="for fast and reliable inspections"
              />
            )}
            <Button
              color={colors.primaryContrastText}
              onPress={goToInspections}
              accessibilityLabel="Inspections"
            >
              Inspections
            </Button>
            <Button
              color={colors.primaryContrastText}
              onPress={handleSignOut}
              accessibilityLabel="Sign out"
            >
              Sign out
            </Button>
          </Appbar.Header>
        ),
      });
    }
  }, [colors, goToInspections, handleSignOut, isMediumSize, navigation]);

  return (
    <View style={styles.root}>
      <StatusBar />
      <SafeAreaView style={styles.root}>
        <Drawing xml={drawing} height={200} />
        <Text style={styles.text}>
          Take your car damage inspection to a next level, using only your device camera
        </Text>
        <Button onPress={handleStart} mode="contained">
          Start an inspection
        </Button>
      </SafeAreaView>
    </View>
  );
};
