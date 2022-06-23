import { useError, utils } from '@monkvision/toolkit';
import axios from 'axios';
import ExpoConstants from 'expo-constants';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Button, Paragraph, Title, useTheme } from 'react-native-paper';
import { Loader } from '@monkvision/ui';

import * as names from 'screens/names';

import useAuth from 'hooks/useAuth';
import useSignIn from 'hooks/useSignIn';
import Sentry from '../../config/sentry';
import { setUser } from '../../config/sentryPlatform';
import useUpdateInspectionVehicle from './useUpdateInspectionVehicle';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  p: {
    textAlign: 'center',
  },
  button: {
    marginTop: utils.styles.spacing(2),
  },
});

export default function InspectionVehicleUpdate() {
  const navigation = useNavigation();
  const { isAuthenticated, accessToken } = useAuth();
  const { height } = useWindowDimensions();
  const { errorHandler, Constants } = useError(Sentry);
  const { colors, loaderDotsColors } = useTheme();

  const route = useRoute();

  const { inspectionId, vin } = route.params || {};

  const [authError, setAuthError] = useState(false);
  const [signIn, isSigningIn] = useSignIn({
    onError: (err, request) => {
      errorHandler(err, Constants.type.APP, request);
      setAuthError(true);
    },
  });

  const updateInspectionVehicle = useUpdateInspectionVehicle(inspectionId, vin);
  const handleUpdate = useCallback(async () => {
    const response = await updateInspectionVehicle.start();
    if (response !== null) {
      Sentry.Browser.setTag('inspection_id', response.result);
      navigation.navigate(names.LANDING, route.params);
    }
  }, [updateInspectionVehicle.start]);

  const handleGoBack = useCallback(
    () => navigation.navigate(names.LANDING, route.params),
    [navigation],
  );

  useFocusEffect(useCallback(() => {
    if (!isAuthenticated && !isSigningIn) { signIn(); }
  }, [isAuthenticated, isSigningIn, signIn]));

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`https://${ExpoConstants.manifest.extra.AUTH_DOMAIN}/userinfo?access_token=${accessToken}`)
        .then(({ data }) => {
          setUser(data.sub);
        });
    }
  }, [isAuthenticated]);

  useEffect(useCallback(() => {
    const { loading, error } = updateInspectionVehicle.state;
    if (isAuthenticated && !loading && !error) { handleUpdate(); }
  }, [isAuthenticated, handleUpdate, updateInspectionVehicle]));

  useEffect(() => {
    const { state } = updateInspectionVehicle;
    if (state.error) { errorHandler(state.error, Constants.type.APP, state); }
  }, [updateInspectionVehicle.state.error]);

  if (isSigningIn) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Loader texts={[`Signing in`, `Authenticating`, `Checking you're not a robot`]} />
      </View>
    );
  }

  if (authError === true) {
    <View style={[styles.root, { backgroundColor: colors.background, height }]}>
      <Title>Sorry 😞</Title>
      <Paragraph style={styles.p}>
        An error occurred while authenticating, please try again in a minute.
      </Paragraph>
      <Button style={styles.button} onPress={handleGoBack}>Go back to home page</Button>
    </View>;
  }

  if (updateInspectionVehicle.state.loading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Loader texts={[`Updating the inspection`, `Waking up the AI`]} />
      </View>
    );
  }

  if (updateInspectionVehicle.state.error) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Title>Sorry 😞</Title>
        <Paragraph style={styles.p}>
          An error occurred while updating the inspection, please try again in a minute.
        </Paragraph>
        <Button style={styles.button} onPress={handleGoBack}>Go back to home page</Button>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background, height }]}>
      <Loader texts={[`Processing...`]} colors={loaderDotsColors} />
    </View>
  );
}
