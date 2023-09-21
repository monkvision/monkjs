import { utils } from '@monkvision/toolkit';
import axios from 'axios';
import ExpoConstants from 'expo-constants';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Button, Paragraph, Title, useTheme } from 'react-native-paper';
import { Loader } from '@monkvision/ui';
import { useMonitoring } from '@monkvision/corejs';

import * as names from 'screens/names';

import useAuth from 'hooks/useAuth';
import useSignIn from 'hooks/useSignIn';
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
  const { errorHandler } = useMonitoring();
  const { t } = useTranslation();
  const { colors, loaderDotsColors } = useTheme();

  const route = useRoute();

  const { inspectionId, vin, vehicle } = route.params || {};

  const [authError, setAuthError] = useState(false);
  const [signIn, isSigningIn] = useSignIn({
    onError: (err) => {
      errorHandler(err);
      setAuthError(true);
    },
  });

  const updateInspectionVehicle = useUpdateInspectionVehicle(inspectionId, { ...vehicle, vin });
  const handleUpdate = useCallback(async () => {
    const response = await updateInspectionVehicle.start();
    if (response !== null) {
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
      axios.get(`https://${ExpoConstants.manifest.extra.AUTH_DOMAIN}/userinfo?access_token=${accessToken}`).then(() => { });
    }
  }, [isAuthenticated]);

  useEffect(useCallback(() => {
    const { loading, error } = updateInspectionVehicle.state;
    if (isAuthenticated && !loading && !error) { handleUpdate(); }
  }, [isAuthenticated, handleUpdate, updateInspectionVehicle]));

  useEffect(() => {
    const { state } = updateInspectionVehicle;
    if (state.error) {
      errorHandler(state.error);
    }
  }, [updateInspectionVehicle.state.error]);

  if (isSigningIn) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Loader texts={[
          t('signin.loader.signingIn'),
          t('signin.loader.authenticating'),
          t('signin.loader.robot'),
        ]}
        />
      </View>
    );
  }

  if (authError === true) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Title>{t('signin.error.title')}</Title>
        <Paragraph style={styles.p}>
          {t('signin.error.message')}
        </Paragraph>
        <Button style={styles.button} onPress={handleGoBack}>
          {t('signin.error.button')}
        </Button>
      </View>
    );
  }

  if (updateInspectionVehicle.state.loading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Loader texts={[
          t('updateInspection.loader.updating'),
          t('updateInspection.loader.waking'),
        ]}
        />
      </View>
    );
  }

  if (updateInspectionVehicle.state.error) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Title>{t('updateInspection.error.title')}</Title>
        <Paragraph style={styles.p}>
          {t('updateInspection.error.message')}
        </Paragraph>
        <Button style={styles.button} onPress={handleGoBack}>{t('updateInspection.error.button')}</Button>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background, height }]}>
      <Loader texts={[t('updateInspection.loader.processing')]} colors={loaderDotsColors} />
    </View>
  );
}
