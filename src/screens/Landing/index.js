import monk, { useMonitoring } from '@monkvision/corejs';
import { useInterval } from '@monkvision/toolkit';
import { authSlice } from 'store';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useAuth from 'hooks/useAuth';
import useSnackbar from 'hooks/useSnackbar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import useGetInspection from 'screens/Landing/useGetInspection';
import * as names from 'screens/names';
import styles from './styles';
import useZlibCompression from './useZlibCompression';

export default function Landing() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { errorHandler } = useMonitoring();
  const { t } = useTranslation();
  const { setShowTranslatedMessage } = useSnackbar(true);
  const { decompress } = useZlibCompression();

  const [vehicleType, setVehicleType] = useState('');
  const dispatch = useDispatch();

  const { inspectionId, token } = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const compressedToken = urlParams.get('t');

    return {
      inspectionId: urlParams.get('i'),
      token: compressedToken ? decompress(compressedToken) : undefined,
    };
  }, []);

  const invalidParams = useMemo(
    () => (!inspectionId || !token),
    [inspectionId, token],
  );

  useEffect(() => {
    if (token) {
      monk.config.accessToken = token;

      dispatch(authSlice.actions.update({
        accessToken: token,
        tokenType: 'Bearer',
        scope: 'openid profile email',
        isLoading: false,
        isSignedOut: false,
      }));
    }
  }, [token]);

  const getInspection = useGetInspection(inspectionId);

  const invalidToken = useMemo(
    () => (getInspection?.state?.error?.response?.status === 401),
    [getInspection],
  );

  const inspection = useMemo(
    () => getInspection?.denormalizedEntities[0],
    [getInspection],
  );

  const allTasksAreCompleted = useMemo(
    () => inspection?.tasks?.length && inspection?.tasks
      .every(({ status }) => status === monk.types.ProgressStatus.DONE),
    [inspection?.tasks],
  );

  const start = useCallback(() => {
    if (inspectionId && getInspection.state.loading !== true && !invalidToken) {
      getInspection.start().catch((err) => {
        errorHandler(err);
      });
    }
  }, [getInspection]);

  const intervalId = useInterval(start, 1000);

  useFocusEffect(useCallback(() => {
    start();
    return () => clearInterval(intervalId);
  }, [intervalId]));

  useEffect(() => {
    if (inspectionId && !allTasksAreCompleted) {
      setShowTranslatedMessage('landing.workflowReminder');
    } else { setShowTranslatedMessage(null); }
  }, [allTasksAreCompleted, inspectionId]);

  const invalidParamsContent = useMemo(() => (
    <View style={[styles.invalidParamsContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.invalidParamsMessage]}>
        {t(invalidParams ? 'landing.invalidParams' : 'landing.invalidToken')}
      </Text>
    </View>
  ), [invalidParams]);

  useEffect(() => {
    if (!invalidParams && !invalidToken && isAuthenticated) {
      navigation.navigate(
        names.INSPECTION_REPORT,
        {
          inspectionId,
          vehicle: { vehicleType },
          isLastTour: true,
        },
      );
    }
  }, [invalidParams, invalidToken, inspectionId, navigation, isAuthenticated, vehicleType])

  return (invalidParams || invalidToken) && invalidParamsContent;
}
