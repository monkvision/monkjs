import { useError } from '@monkvision/toolkit/src';
import React, { useCallback, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Button, Paragraph, Title, useTheme } from 'react-native-paper';
import { Loader } from '@monkvision/ui';
import { utils } from '@monkvision/toolkit';

import * as names from 'screens/names';

import useAuth from 'hooks/useAuth';
import useSignIn from 'hooks/useSignIn';
import Sentry from '../../../config/sentry';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: utils.styles.spacing(2),
  },
  p: {
    textAlign: 'center',
  },
  button: {
    marginTop: utils.styles.spacing(2),
  },
});

export default function SignIn() {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { height } = useWindowDimensions();
  const { colors, loaderDotsColors } = useTheme();
  const { errorHandler, Constants } = useError(Sentry);

  const route = useRoute();
  const { inspectionId, selectedMod, to = null } = route.params || {};

  const [authError, setAuthError] = useState(false);
  const [signIn, isSigningIn] = useSignIn({
    onError: (error, request) => {
      setAuthError(true);
      errorHandler(error, Constants.type.APP, request);
    },
  });

  const handleGoBack = useCallback(
    () => navigation.navigate(names.LANDING),
    [navigation],
  );

  const handleNext = useCallback(
    () => navigation.navigate(to || names.INSPECTION_CREATE, { inspectionId, selectedMod }),
    [navigation, inspectionId, selectedMod],
  );

  if (isAuthenticated) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Title>Authenticated!</Title>
        <Paragraph style={styles.p}>
          You are logged in! Now you can start a new inspection.
        </Paragraph>
        <Button mode="contained" color={colors.success} style={styles.button} onPress={handleNext}>
          Start inspection
        </Button>
      </View>
    );
  }

  if (isSigningIn) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Loader
          texts={[`Signing in`, `Authenticating`, `Checking you're not a robot`, `Loading`]}
          colors={loaderDotsColors}
        />
      </View>
    );
  }

  if (authError === true) {
    <View style={[styles.root, { backgroundColor: colors.background, height }]}>
      <Title>Sorry 😞</Title>
      <Paragraph style={styles.p}>
        An error occurred while authenticating, please try again in a minute.
      </Paragraph>
      <Button style={styles.button} onPress={handleGoBack}>
        Go back to home page
      </Button>
    </View>;
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background, height }]}>
      <Title>Authentication requested.</Title>
      <Paragraph style={styles.p}>
        Please sign in to start an inspection.
      </Paragraph>
      <Button mode="contained" style={styles.button} onPress={signIn}>Sign In</Button>
    </View>
  );
}
