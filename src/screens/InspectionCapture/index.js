import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { Alert, Platform, View } from 'react-native';

import { Capture, Controls, useSettings } from '@monkvision/camera';
import monk, { useMonitoring, MonitoringStatus, SentryConst } from '@monkvision/corejs';
import { utils } from '@monkvision/toolkit';

import * as names from 'screens/names';
import mapTasksToSights from './mapTasksToSights';
import Settings from './settings';
import styles from './styles';
import useSnackbar from '../../hooks/useSnackbar';

const enableComplianceCheck = true;

export default function InspectionCapture() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { errorHandler, measurePerformance } = useMonitoring();

  const { inspectionId, sightIds, taskName, vehicleType, selectedMode } = route.params;

  const [isFocused, setFocused] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const { setShowMessage, Notice } = useSnackbar();
  const captureTourTransRef = useRef({});

  const handleNavigate = useCallback((confirm = false) => {
    if (confirm) {
      if (Platform.OS === 'web') {
        // eslint-disable-next-line no-alert
        const ok = window.confirm(t('capture.quit.title'));
        if (ok) {
          /**
           * cancel 'Capture Tour' transaction and navigate back to landing page
           */
          utils.log(['[Click]', 'User suddenly quit the inspection']);
          captureTourTransRef.current.transaction.finish(MonitoringStatus.Cancelled);
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
            /**
             * cancel 'Capture Tour' transaction and navigate back to landing page
             */
            utils.log(['[Click]', 'User suddenly quit the inspection']);
            captureTourTransRef.current.transaction.finish(MonitoringStatus.Cancelled);
            navigation.navigate(names.LANDING, { inspectionId });
          },
        }],
        { cancelable: true },
      );
    } else { navigation.navigate(names.LANDING, { inspectionId }); }
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
          .filter(((taskBySight) => sightIds.includes(taskBySight.id)))
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
         * finish 'capture tour' transaction and navigate back to landing page
         */
        utils.log(['[Event] Back to landing page with photo taken']);
        captureTourTransRef.current.transaction.finish();
        handleNavigate();
      } catch (err) {
        // sentry code for error capturing
        errorHandler(err);
        setCameraLoading(false);
      }
    }
  }, [dispatch, handleNavigate, inspectionId, success, taskName, isFocused]);

  const handleChange = useCallback((state) => {
    /**
     * add takenPictures tag in "Capture Tour" transaction for a tour
     */
    const takenPicturesLen = Object.values(state.sights.state.takenPictures).length;
    const refObj = captureTourTransRef.current;
    if (takenPicturesLen && refObj.transaction && takenPicturesLen !== refObj.takenPictures) {
      refObj.takenPictures = takenPicturesLen;
      refObj.transaction.setTag(SentryConst.TAG.takenPictures, takenPicturesLen);
    }
    //
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
        // sentry code for error capturing
        errorHandler(err);
        // eslint-disable-next-line no-console
        console.error(err);
        throw err;
      }
    }
  }, [success, isFocused]);

  const captureRef = useRef();

  const settings = useSettings({ camera: captureRef.current?.camera });
  const settingsRef = useRef();
  const openSettings = settingsRef.current?.open;

  const controls = [
    { disabled: cameraLoading, ...Controls.SettingsButtonProps, onPress: openSettings },
    [
      { disabled: cameraLoading, ...Controls.AddDamageButtonProps },
      { disabled: cameraLoading, ...Controls.CaptureButtonProps },
    ],
    { disabled: cameraLoading, onPress: () => handleNavigate(true), ...Controls.GoBackButtonProps },
  ];

  useEffect(() => { if (success) { handleSuccess(); } }, [handleSuccess, success]);

  useEffect(() => {
    /**
     * create a new transaction with operation name 'Capture Tour' to measure tour performance
     */
    const { OPERATION, TRANSACTION, TAG } = SentryConst;
    const transaction = measurePerformance(TRANSACTION.pictureProcessing, OPERATION.captureTour);
    // set tags to identify a transation and relate with an inspection
    transaction.setTag(TAG.task, taskName);
    transaction.setTag(TAG.inspectionId, inspectionId);
    transaction.setTag(TAG.takenPictures, 0);
    captureTourTransRef.current = { transaction, takenPictures: 0 };
  }, []);

  useFocusEffect(() => {
    setFocused(true);
    return () => setFocused(false);
  });

  return (
    <View style={styles.root}>
      <Settings ref={settingsRef} settings={settings} />
      <Capture
        ref={captureRef}
        task={taskName}
        mapTasksToSights={mapTasksToSights}
        sightIds={sightIds}
        inspectionId={inspectionId}
        isFocused={isFocused}
        controls={controls}
        loading={cameraLoading}
        onReady={() => setCameraLoading(false)}
        onStartUploadPicture={() => setCameraLoading(true)}
        onFinishUploadPicture={() => setCameraLoading(false)}
        onWarningMessage={(message) => setShowMessage(message)}
        onChange={handleChange}
        settings={settings}
        enableCarCoverage
        enableComplianceCheck={enableComplianceCheck}
        onComplianceCheckFinish={() => setSuccess(true)}
        colors={colors}
        vehicleType={vehicleType}
        selectedMode={selectedMode}
      />
      <Notice />
    </View>
  );
}
