import { useError, utils } from '@monkvision/toolkit';
import ExpoConstants from 'expo-constants';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Button, Paragraph, Title, useTheme } from 'react-native-paper';
import { Loader } from '@monkvision/ui';
import isEmpty from 'lodash.isempty';

import * as names from 'screens/names';

import useAuth from 'hooks/useAuth';
import useSignIn from 'hooks/useSignIn';
import useCreateInspection from './useCreateInspection';
import Sentry from '../../config/sentry';

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

export default function InspectionCreate() {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { height } = useWindowDimensions();
  const { colors, loaderDotsColors } = useTheme();
  const errorHandler = useError();

  const route = useRoute();
  const { inspectionId: idFromParams, selectedMod: selected } = route.params || {};
  const [inspectionId, setInspectionId] = useState(idFromParams || '');

  const [authError, setAuthError] = useState(false);
  const [signIn, isSigningIn] = useSignIn({
    onError: (err) => {
      errorHandler(err);
      setAuthError(true);
    },
  });

  const createInspection = useCreateInspection();
  const handleCreate = useCallback(async () => {
    if (isEmpty(inspectionId) && isAuthenticated) {
      const response = await createInspection.start(selected);
      if (response !== null) {
        Sentry.Browser.setTag('inspection_id', response.result);
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

    if (isAuthenticated && !isEmpty(inspectionId) && option) {
      const params = {
        inspectionId,
        sightIds: option.sightIds,
        taskName: option.taskName,
      };

      navigation.navigate(names.INSPECTION_CAPTURE, params);
    }
  }, [isAuthenticated, navigation, selected, inspectionId]);

  useFocusEffect(useCallback(() => {
    if (!isAuthenticated && !isSigningIn) { signIn(); }
  }, [isAuthenticated, isSigningIn, signIn]));

  useEffect(useCallback(() => {
    if (isAuthenticated && isEmpty(inspectionId
      && !createInspection.state.loading) && !createInspection.state.error) {
      handleCreate();
    }
  }, [isAuthenticated, inspectionId, handleCreate, createInspection]));

  useEffect(() => {
    if (createInspection.state.error) {
      errorHandler(createInspection.state.error);
    }
  }, [createInspection.state.error]);

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
        <Title>Sorry 😞</Title>
        <Paragraph style={styles.p}>
          An error occurred while creating the inspection, please try again in a minute.
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
