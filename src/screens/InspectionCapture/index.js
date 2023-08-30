import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { Alert, Platform, View } from 'react-native';

import { Capture, Controls } from '@monkvision/camera';
import monk, { useMonitoring } from '@monkvision/corejs';
import { utils } from '@monkvision/toolkit';

import * as names from 'screens/names';
import { Clients, useClient } from '../../contexts';
import mapTasksToSights from './mapTasksToSights';
import styles from './styles';
import useSnackbar from '../../hooks/useSnackbar';
import useFullscreen from './useFullscreen';
import useGetInspection from '../Landing/useGetInspection';

const enableComplianceCheck = true;

export default function InspectionCapture() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { errorHandler } = useMonitoring();

  const { inspectionId, sightIds, taskName, vehicleType, selectedMode } = route.params;
  const { client, sights } = useClient();
  const newSightIds = useMemo(() => ((taskName === monk.types.TaskName.IMAGES_OCR) ? sightIds : (sights[vehicleType ?? 'cuv'])), [sights, vehicleType]);

  const [isFocused, setFocused] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const { setShowMessage, Notice } = useSnackbar();
  const { isFullscreen, requestFullscreen } = useFullscreen();
  const getInspection = useGetInspection(inspectionId);

  const inspection = useMemo(
    () => getInspection?.denormalizedEntities[0],
    [getInspection],
  );

  const allTasks = useMemo(
    () => inspection?.tasks?.length && inspection?.tasks,
    [inspection?.tasks],
  );

  const handleNavigate = useCallback(async (confirm = false) => {
    if (confirm) {
      if (Platform.OS === 'web') {
        // eslint-disable-next-line no-alert
        const ok = window.confirm(t('capture.quit.title'));
        if (ok) {
          navigation.navigate(names.LANDING, { inspectionId });
        }
      }

      Alert.alert(
        t('capture.quit.title'),
        t('capture.quit.message'),
        [{
          text: t('capture.quit.cancel'),
          style: 'cancel',
        }, {
          text: t('capture.quit.ok'),
          onPress: () => {
            navigation.navigate(names.LANDING, { inspectionId });
          },
        }],
        { cancelable: true },
      );
    } else {
      if (client === Clients.CAT) {
        try {
          const damageDetectionTask = allTasks.find(
            (task) => task.name === monk.types.TaskName.DAMAGE_DETECTION,
          );

          if (damageDetectionTask?.arguments?.callbacks?.[0]?.url) {
            await axios.request({
              method: 'post',
              url: damageDetectionTask.arguments.callbacks[0].url,
              data: {
                id: inspectionId,
                tasks: allTasks.map(({ id, name, status }) => ({ id, name, status })),
              },
            });
          }
        } catch (error) {
          console.error(error);
        }
      }

      navigation.navigate(names.LANDING, { inspectionId, captureComplete: true });
    }
  }, [inspectionId, navigation]);

  const getTaskName = useCallback((task) => (typeof task === 'string' ? task : task?.name), []);

  const mapTaskBySightToTasknames = useCallback((taskBySight) => {
    const task = getTaskName(taskBySight.task);
    const tasks = taskBySight.tasks ? taskBySight.tasks.map(getTaskName) : [];
    return [...tasks, task].filter((name) => !!name);
  }, [getTaskName]);

  const handleSuccess = useCallback(async () => {
    if (success && isFocused) {
      setCameraLoading(true);

      try {
        const promises = Object.values(mapTasksToSights)
          .filter(((taskBySight) => newSightIds.includes(taskBySight.id)))
          .map(mapTaskBySightToTasknames)
          .flat()
          .concat([taskName])
          .filter((name, index, taskNames) => taskNames.indexOf(name) === index)
          .map((name) => new Promise((resolve) => {
            monk.entity.task.updateOne(inspectionId, name, {
              status: monk.types.ProgressStatusUpdate.TODO,
            }).then(({ entities, result }) => {
              dispatch(monk.actions.gotOneTask({ entities, result, inspectionId }));
              resolve(name);
            });
          }));

        await Promise.all(promises);
        setCameraLoading(false);

        /**
         * navigate back to landing page
         */
        utils.log(['[Event] Back to landing page with photo taken']);
        handleNavigate();
      } catch (err) {
        errorHandler(err);
        setCameraLoading(false);
      }
    }
  }, [dispatch, handleNavigate, inspectionId, success, taskName, isFocused]);

  const handleChange = useCallback((state) => {
    if (!success && isFocused && !enableComplianceCheck) {
      try {
        const { takenPictures, tour } = state.sights.state;
        const totalPictures = Object.keys(tour).length;
        const uploadState = Object.values(state.uploads.state);
        const complianceState = Object.values(state.compliance.state);

        const fulfilledUploads = uploadState.filter(({ status }) => status === 'fulfilled').length;
        const retriedUploads = uploadState.filter(({ requestCount }) => requestCount > 1).length;
        const failedUploads = uploadState.filter(({ status }) => status === 'rejected').length;

        const hasAllFulfilledAndCompliant = enableComplianceCheck && complianceState
          .every(({ result, status, id }) => (
            state.uploads.state[id].status === 'rejected'
            || (status === 'fulfilled' && result && Object.values(result?.data?.compliances)
              .every((e) => e.is_compliant === true || e.is_compliant === null))));

        const hasPictures = Object.keys(takenPictures).length === totalPictures;
        const hasBeenUploaded = (
          fulfilledUploads === totalPictures
          || retriedUploads >= totalPictures - fulfilledUploads
        );
        const hasFailedUploadButNoCheck = ((failedUploads + fulfilledUploads) === totalPictures);

        if (hasPictures && (hasBeenUploaded || hasFailedUploadButNoCheck) && state
          && hasAllFulfilledAndCompliant) {
          setSuccess(true);
        }
      } catch (err) {
        errorHandler(err);
        throw err;
      }
    }
  }, [success, isFocused]);

  const captureRef = useRef();

  const controls = [
    {
      disabled: cameraLoading,
      ...Controls.getFullScreenButtonProps(isFullscreen),
      onPress: requestFullscreen,
    },
    [
      { disabled: cameraLoading, ...Controls.AddDamageButtonProps },
      { disabled: cameraLoading, ...Controls.CaptureButtonProps },
    ],
    {
      ...Controls.CloseEarlyButtonProps,
      confirm: true,
      confirmationMessage: {
        en: 'Your inspection is not complete, are you sure you want to stop it ?',
        fr: 'Votre inspection n\'est pas complète, êtes-vous sûr(e) de vouloir l\'arrêter ?',
      },
      disabled: cameraLoading,
    },
  ];

  useEffect(() => { if (success) { handleSuccess(); } }, [handleSuccess, success]);

  useFocusEffect(() => {
    setFocused(true);
    return () => setFocused(false);
  });

  return (
    <View style={styles.root}>
      <Capture
        ref={captureRef}
        task={taskName}
        enableCarCoverage
        mapTasksToSights={mapTasksToSights}
        sightIds={newSightIds}
        inspectionId={inspectionId}
        isFocused={isFocused}
        controls={controls}
        loading={cameraLoading}
        onReady={() => setCameraLoading(false)}
        onStartUploadPicture={() => setCameraLoading(true)}
        onFinishUploadPicture={() => setCameraLoading(false)}
        onWarningMessage={(message) => setShowMessage(message)}
        onChange={handleChange}
        enableComplianceCheck={enableComplianceCheck}
        onComplianceCheckFinish={() => setSuccess(true)}
        colors={colors}
        vehicleType={vehicleType}
        selectedMode={selectedMode}
      // overlayPathStyles={{ strokeWidth: 8 }}
      />
      <Notice />
    </View>
  );
}
