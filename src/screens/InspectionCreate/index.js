import { useSentry, utils } from '@monkvision/toolkit';
import axios from 'axios';
import ExpoConstants from 'expo-constants';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Button, Paragraph, Title, useTheme } from 'react-native-paper';
import { Loader } from '@monkvision/ui';
import { SentryConstants } from '@monkvision/toolkit/src/hooks/useSentry';
import isEmpty from 'lodash.isempty';

import * as names from 'screens/names';

import useAuth from 'hooks/useAuth';
import useSignIn from 'hooks/useSignIn';
import useCreateInspection from './useCreateInspection';
import Sentry from '../../config/sentry';
import { setTag, setUser } from '../../config/sentryPlatform';

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

const CAR_360 = 'car360';

export default function InspectionCreate() {
  const navigation = useNavigation();
  const { isAuthenticated, accessToken } = useAuth();
  const { height } = useWindowDimensions();
  const { errorHandler } = useSentry(Sentry);
  const { t } = useTranslation();
  const { colors, loaderDotsColors } = useTheme();

  const route = useRoute();

  const {
    inspectionId: idFromParams,
    selectedMod: selected,
    vin,
    mode,
    vehicle,
  } = route.params || {};

  const [inspectionId, setInspectionId] = useState(idFromParams || '');

  const [authError, setAuthError] = useState(false);
  const [signIn, isSigningIn] = useSignIn({
    onError: (err, request) => {
      errorHandler(err, SentryConstants.type.APP, request);
      setAuthError(true);
    },
  });

  const createInspection = useCreateInspection({ ...vehicle, vin });
  const handleCreate = useCallback(async () => {
    if (isEmpty(inspectionId) && isAuthenticated && createInspection.state.count < 1) {
      utils.log(['[Click] Inspection task chosen: ', selected]);
      const response = await createInspection.start(selected);
      if (response !== null) {
        setTag('inspection_id', response.result);
        setInspectionId(response.result);
      }
    }
  }, [inspectionId, isAuthenticated, createInspection]);

  const handleGoBack = useCallback(
    () => navigation.navigate(names.LANDING),
    [navigation],
  );

  useEffect(() => {
    const option = ExpoConstants.manifest.extra.options.find((o) => o.value === selected);
    if (!isAuthenticated || isEmpty(inspectionId) || !option) { return; }

    if (mode === 'manually') { navigation.navigate(names.LANDING, { ...route.params, inspectionId }); return; }

    const vehicleType = vehicle.vehicleType || 'cuv';
    const sightIds = option.value === CAR_360 ? option.sightIds[vehicleType] : option.sightIds;

    const args = {
      inspectionId,
      sightIds,
      taskName: option.taskName,
      selectedMode: selected,
    };

    navigation.navigate(names.INSPECTION_CAPTURE, args);
  }, [isAuthenticated, navigation, selected, inspectionId]);

  useFocusEffect(useCallback(() => {
    if (!isAuthenticated && !isSigningIn) { signIn(); }
  }, [isAuthenticated, isSigningIn, signIn]));

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`https://${ExpoConstants.manifest.extra.AUTH_DOMAIN}/userinfo?access_token=${accessToken}`)
        .then(({ data }) => {
          if (data.email) { setTag('company', data.email.split('@')[1].split('.')[0]); }
          setUser(data.sub);
        });
    }
  }, [isAuthenticated]);

  useEffect(useCallback(() => {
    if (isAuthenticated && isEmpty(inspectionId
      && !createInspection.state.loading) && !createInspection.state.error) {
      handleCreate();
    }
  }, [isAuthenticated, inspectionId, handleCreate, createInspection]));

  useEffect(() => {
    if (createInspection.state.error) {
      errorHandler(createInspection.state.error, SentryConstants.type.APP, createInspection.state);
    }
  }, [createInspection.state.error]);

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

  if (createInspection.state.loading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Loader texts={[`Creating inspection`, `Waking up the AI`]} />
      </View>
    );
  }

  if (createInspection.state.error) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Title>{t('createInspection.error.title')}</Title>
        <Paragraph style={styles.p}>
          {t('createInspection.error.message')}
        </Paragraph>
        <Button style={styles.button} onPress={handleGoBack}>{t('createInspection.error.button')}</Button>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background, height }]}>
      <Loader texts={[`Processing...`]} colors={loaderDotsColors} />
    </View>
  );
}
