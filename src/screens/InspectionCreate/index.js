import { utils } from '@monkvision/toolkit';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Button, Paragraph, Title, useTheme } from 'react-native-paper';
import { Loader } from '@monkvision/ui';
import isEmpty from 'lodash.isempty';
import { Constants } from '@monkvision/camera';

import * as names from 'screens/names';

import useAuth from 'hooks/useAuth';
import useSignIn from 'hooks/useSignIn';
import useCreateInspection, { TASKS_BY_MOD } from './useCreateInspection';

export const SIGHTS_IDS_BY_MOD = {
  vinNumber: [
    'sLu0CfOt', // Vin number
  ],
  car360: [
    'WKJlxkiF', // Beauty Shot
    'vxRr9chD', // Front Bumper Side Left
    'cDe2q69X', // Front Fender Left
    'R_f4g8MN', // Doors Left
    'vedHBC2n', // Front Roof Left
    'McR3TJK0', // Rear Lateral Left
    '7bTC-nGS', // Rear Fender Left
    'hhCBI9oZ', // Rear
    'e_QIW30o', // Rear Fender Right
    'fDo5M0Fp', // Rear Lateral Right
    'fDKWkHHp', // Doors Right
    '5CFsFvj7', // Front Fender Right
    'g30kyiVH', // Front Bumper Side Right
    'I0cOpT1e', // Front

    'IqwSM3', // Front seats
    'rj5mhm', // Back seats
    'qhKA2z', // Trunk
    'rSvk2C', // Dashboard
  ],
  wheels: [
    'xQKQ0bXS', // Front wheel left
    '8_W2PO8L', // Rear wheel left
    'rN39Y3HR', // Rear wheel right
    'PuIw17h0', // Front wheel right
  ],
  interior: [
    'IqwSM3', // Front seats
    'rj5mhm', // Back seats
    'qhKA2z', // Trunk
  ],
  dashboard: [
    'rSvk2C', // Dashboard
  ],
  classic: Constants.defaultSightIds,
};

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
  const { colors } = useTheme();

  const route = useRoute();
  const { inspectionId: idFromParams, selectedMod } = route.params || {};
  const [inspectionId, setInspectionId] = useState(idFromParams || '');

  const [authError, setAuthError] = useState(false);
  const [signIn, isSigningIn] = useSignIn({
    onError: () => setAuthError(true),
  });

  const createInspection = useCreateInspection();
  const handleCreate = useCallback(async () => {
    if (isEmpty(inspectionId) && isAuthenticated) {
      const response = await createInspection.start(selectedMod);
      if (response !== null) { setInspectionId(response.result); }
    }
  }, [inspectionId, isAuthenticated, createInspection]);

  const handleGoBack = useCallback(
    () => navigation.navigate(names.LANDING),
    [navigation],
  );

  useEffect(() => {
    if (isAuthenticated && !isEmpty(inspectionId)) {
      const params = {
        inspectionId,
        sightIds: SIGHTS_IDS_BY_MOD[selectedMod],
        taskName: TASKS_BY_MOD[selectedMod],
      };

      navigation.navigate(names.INSPECTION_CAPTURE, params);
    }
  }, [isAuthenticated, navigation, selectedMod, inspectionId]);

  useFocusEffect(useCallback(() => {
    if (!isAuthenticated && !isSigningIn) { signIn(); }
  }, [isAuthenticated, isSigningIn, signIn]));

  useEffect(useCallback(() => {
    if (isAuthenticated && isEmpty(inspectionId && !createInspection.state.loading)) {
      handleCreate();
    }
  }, [isAuthenticated, inspectionId, handleCreate, createInspection]));

  if (isSigningIn) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Loader texts={[`Signing in`, `Authenticating`, `Checking you're not a decepticon`]} />
      </View>
    );
  }

  if (authError === true) {
    <View style={[styles.root, { backgroundColor: colors.background, height }]}>
      <Title>Sorry 😞</Title>
      <Paragraph style={styles.p}>
        An error occurred will authenticating, please try again in a minute.
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
          An error occurred will creating the inspection, please try again in a minute.
        </Paragraph>
        <Button style={styles.button} onPress={handleGoBack}>Go back to home page</Button>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background, height }]}>
      <Loader texts={[`Processing...`]} />
    </View>
  );
}
