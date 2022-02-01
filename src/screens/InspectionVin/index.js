import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Platform, StyleSheet } from 'react-native';
import { useTheme, Snackbar } from 'react-native-paper';
import { useFakeActivity, ActivityIndicatorView, CameraView, useToggle } from '@monkvision/react-native-views';
import { createOneInspection,
  Sight,
  values as sightValues,
  updateOneTaskOfInspection,
  selectVehicleEntities,
  selectTaskEntities,
  selectInspectionEntities,
  getOneInspectionById,
  inspectionsEntity,
  vehiclesEntity,
  tasksEntity,
  taskStatuses,
} from '@monkvision/corejs';
import { denormalize } from 'normalizr';

import useRequest from 'hooks/useRequest';
import useInterval from 'hooks/useInterval';
import useUpload from 'hooks/useUpload';
import { useSelector } from 'react-redux';
import VinGuide from './VinGuide';
import VinForm from './VinForm';

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    height: '100%',
  },
  snackbar: {
    position: 'absolute',
    bottom: 0,
  },
  snackbarButton: {
    color: '#FFF',
  },
});

const vinSight = Object.values(sightValues.sights.abstract).map((s) => new Sight(...s)).filter((item) => item.id === 'vin');

export default () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [inspectionId, setInspectionId] = useState(null);
  const [vinPicture, setVinPicture] = useState();

  const [camera, toggleOnCamera, toggleOffCamera] = useToggle();
  const [uploading, toggleOnUploading, toggleOffUploading] = useToggle();
  const [guideIsOpen, handleOpenGuide, handleCloseGuide] = useToggle();
  const [snackbarIsvVisible, handleOpenErrorSnackbar, handleDismissErrorSnackbar] = useToggle();

  const payload = { data: { tasks: { damage_detection: { status: 'NOT_STARTED' }, images_ocr: { status: 'NOT_STARTED' } } } };
  const callbacks = {
    onSuccess: ({ result }) => setInspectionId(result),
    onError: handleOpenErrorSnackbar };

  const {
    isLoading,
    request: createInspection } = useRequest(createOneInspection(payload), callbacks);
  const { refresh } = useRequest(getOneInspectionById({ id: inspectionId }), {}, false);

  const vehiclesEntities = useSelector(selectVehicleEntities);
  const tasksEntities = useSelector(selectTaskEntities);
  const inspectionEntities = useSelector(selectInspectionEntities);

  const { inspection } = denormalize({ inspection: inspectionId }, {
    inspection: inspectionsEntity,
    vehicles: [vehiclesEntity],
    tasks: [tasksEntity],
  }, {
    inspections: inspectionEntities,
    vehicles: vehiclesEntities,
    tasks: tasksEntities,
  });

  const lastDetectedVin = inspection?.vehicle?.vin;
  const updateVehicleRequiredFields = {
    marketValue: inspection?.vehicle?.marketValue,
    mileage: inspection?.vehicle?.mileage,
  };

  const lastOcrTask = useMemo(() => {
    const allOcrTasks = inspection?.tasks?.filter((task) => task?.name === 'images_ocr');
    return allOcrTasks?.find((_, i) => i === allOcrTasks?.length - 1);
  }, [inspection]);

  const delay = useMemo(() => {
    if (lastOcrTask?.status !== taskStatuses.DONE && vinPicture) { return 3000; }
    return null;
  }, [lastOcrTask, vinPicture]);
  useInterval(refresh, delay);

  const ocrPayload = { inspectionId, taskName: 'images_ocr', data: { status: taskStatuses.TODO } };
  const {
    request: startOcr,
    isLoading: ocrIsLoading,
  } = useRequest(updateOneTaskOfInspection(ocrPayload),
    { onSuccess: refresh, onError: handleOpenErrorSnackbar }, false);

  const handleOpenVinCameraOrRetake = useCallback(() => {
    if (vinPicture) { setVinPicture(null); }

    navigation?.setOptions({ headerShown: false });
    toggleOnCamera();
  }, [navigation, toggleOnCamera, vinPicture]);

  const handleCloseVinCamera = useCallback(() => {
    navigation?.setOptions({ headerShown: true });
    toggleOffCamera();
  }, [navigation, toggleOffCamera]);

  const upload = useUpload({
    inspectionId,
    onSuccess: (_, uri) => { startOcr(); toggleOffUploading(); setVinPicture(uri); },
    onLoading: toggleOnUploading,
    onError: () => { toggleOffUploading(); handleOpenErrorSnackbar(); },
    taskName: {
      name: 'images_ocr',
      image_details: {
        image_type: 'VIN',
      } },
  });

  const handleUploadVin = useCallback((pic) => {
    upload(Platform.OS === 'web' ? pic.source.base64 : pic.source.uri, vinSight[0].id);
  }, [upload]);

  const [fakeActivity] = useFakeActivity(isLoading);
  const [uploadingFakeActivity] = useFakeActivity(uploading);
  const [ocrLoadingFakeActivity] = useFakeActivity(ocrIsLoading);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setInspectionId(null);
      setVinPicture(null);
      createInspection();
    });

    return unsubscribe;
  }, [createInspection, navigation]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Inspection VIN',
      });
    }
  }, [navigation]);

  if (fakeActivity) { return <ActivityIndicatorView light />; }

  if (camera) {
    return (
      <CameraView
        sights={vinSight}
        isLoading={fakeActivity}
        onTakePicture={(pic) => handleUploadVin(pic)}
        onSuccess={handleCloseVinCamera}
        theme={theme}
      />
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <VinGuide isOpen={guideIsOpen} handleClose={handleCloseGuide} />
      <VinForm
        inspectionId={inspectionId}
        vin={lastDetectedVin}
        status={lastOcrTask?.status}
        handleOpenGuide={handleOpenGuide}
        handleOpenCamera={handleOpenVinCameraOrRetake}
        vinPicture={vinPicture}
        ocrIsLoading={!!ocrLoadingFakeActivity}
        isUploading={!!uploadingFakeActivity}
        requiredFields={updateVehicleRequiredFields}
        handleOpenErrorSnackbar={handleOpenErrorSnackbar}
      />
      <Snackbar
        visible={snackbarIsvVisible}
        onDismiss={handleDismissErrorSnackbar}
        style={[{ backgroundColor: theme.colors.error }, styles.snackbar]}
        action={{ label: 'Ok', onPress: handleDismissErrorSnackbar, labelStyle: styles.snackbarButton }}
      >
        Request failed, please try again.
      </Snackbar>
    </SafeAreaView>
  );
};
