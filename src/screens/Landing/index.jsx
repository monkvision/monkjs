import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useLayoutEffect } from 'react';

import { GETTING_STARTED, INSPECTIONS } from 'screens/names';
import { spacing } from 'config/theme';

import { useNavigation } from '@react-navigation/native';
import useAuth from 'hooks/useAuth';

import MonkIcon from 'components/Icons/MonkIcon';
import Drawing from 'components/Drawing';
import { Button, Text, useTheme } from 'react-native-paper';
import { StyleSheet, Platform, SafeAreaView, View } from 'react-native';

import drawing from './drawing.svg';

const styles = StyleSheet.create({
  root: {
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flexGrow: 1, minHeight: 'calc(100vh - 64px)' },
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
  button: {
    margin: spacing(1),
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});

export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { signOut } = useAuth();

  const handleSignOut = useCallback(signOut, [signOut]);
  const handleStart = useCallback(() => navigation.navigate(GETTING_STARTED), [navigation]);
  const handleList = useCallback(() => navigation.navigate(INSPECTIONS), [navigation]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        headerTitle: () => (
          <MonkIcon
            width={100}
            height={44}
            color={colors.primary}
            style={styles.logo}
            alt="Monk logo"
          />
        ),
        headerRight: () => (
          <Button onPress={handleSignOut} accessibilityLabel="Sign out">
            Sign out
          </Button>
        ),
      });
    }
  }, [colors, handleSignOut, navigation]);

  return (
    <View style={styles.root}>
      <StatusBar />
      <SafeAreaView style={styles.root}>
        <Drawing xml={drawing} height={200} />
        <Text style={styles.text}>
          Take your car damage inspection to a next level, using only your device camera
        </Text>
        <View style={styles.actions}>
          <Button onPress={handleStart} mode="contained" style={styles.button}>
            Start an inspection
          </Button>
          <Button onPress={handleList} mode="contained" style={styles.button}>
            See previous ones
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};
