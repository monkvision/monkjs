import { Constants } from '@monkvision/camera';
import React, { useCallback, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Loader } from '@monkvision/ui';
import isEmpty from 'lodash.isempty';

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
});

export default function InspectionCreate() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const route = useRoute();
  const { inspectionId: idFromParams, selectedMod } = route.params || {};

  const { isAuthenticated } = useAuth();
  const [signIn, isSigningIn] = useSignIn();

  const createInspection = useCreateInspection();

  const handleStart = useCallback(async () => {
    const params = {
      inspectionId: idFromParams || '',
      sightIds: SIGHTS_IDS_BY_MOD[selectedMod],
      taskName: TASKS_BY_MOD[selectedMod],
    };

    if (isEmpty(params.inspectionId)) {
      const response = await createInspection.start(selectedMod);
      params.inspectionId = response.result;
    }

    navigation.navigate(names.INSPECTION_CAPTURE, params);
  }, [createInspection, idFromParams, navigation, selectedMod]);

  useEffect(() => {
    if (isAuthenticated && !createInspection.state.loading) { handleStart(); }
  }, [createInspection.state.loading, handleStart, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && !isSigningIn) { signIn(); }
  }, [isAuthenticated, isSigningIn, signIn]);

  if (isSigningIn) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <Loader
          texts={[`Signing in`, `Authenticating`, `Checking you're not a decepticon`]}
        />
      </View>
    );
  }

  if (createInspection.state.loading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <Loader texts={[`Creating inspection`, `Waking up the AI`]} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]} />
  );
}
