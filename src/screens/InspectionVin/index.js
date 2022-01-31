import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useFakeActivity, ActivityIndicatorView, CameraView, useToggle } from '@monkvision/react-native-views';
import { createOneInspection,
  Sight,
  values as sightValues,
  updateOneTaskOfInspection,
  selectVehicleEntities,
  getOneInspectionById,
  vehiclesEntity,
} from '@monkvision/corejs';
import { denormalize } from 'normalizr';

import useRequest from 'hooks/useRequest/index';
import useUpload from 'hooks/useUpload/index';
import { useSelector } from 'react-redux';
import VinGuide from './VinGuide/index';
import VinForm from './VinForm/index';

const vinSight = Object.values(sightValues.sights.abstract).map((s) => new Sight(...s)).filter((item) => item.id === 'vin');

export default () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [uploading, toggleOnUploading, toggleOffUploading] = useToggle();
  const [inspectionId, setInspectionId] = useState(false);
  const [camera, setCamera] = useState(false);
  const [vinPicture, setVinPicture] = useState();

  const [guideIsOpen, handleOpenGuide, handleCloseGuide] = useToggle();

  const payload = { data: { tasks: { damage_detection: { status: 'NOT_STARTED' }, images_ocr: { status: 'NOT_STARTED' } } } };
  const callbacks = { onSuccess: ({ result }) => setInspectionId(result) };

  const { isLoading } = useRequest(createOneInspection(payload), callbacks);
  const { refresh } = useRequest(getOneInspectionById({ id: inspectionId }), false);
  const vehiclesEntities = useSelector(selectVehicleEntities);

  const { inspection } = denormalize({ inspection: inspectionId }, {
    vehicles: [vehiclesEntity] }, { vehicles: vehiclesEntities });

  const vin = inspection?.vehicle?.vin;
  // console.log(vehiclesEntities[inspectionId]);
  const ocrPayload = { inspectionId, taskName: 'images_ocr', data: { status: 'TODO' } };
  const {
    request: startOcr,
    isLoading: ocrIsLoading,
  } = useRequest(updateOneTaskOfInspection(ocrPayload), { onSuccess: refresh }, false);

  const handleOpenVinCameraOrRetake = useCallback(() => {
    if (vinPicture) { setVinPicture(null); }

    navigation?.setOptions({ headerShown: false });
    setCamera(true);
  }, [navigation, vinPicture]);

  const handleCloseVinCamera = useCallback(() => {
    navigation?.setOptions({ headerShown: true });
    setCamera(false);
  }, [navigation]);

  const upload = useUpload({
    inspectionId,
    onSuccess: () => { startOcr(); toggleOffUploading(); },
    onLoading: toggleOnUploading,
    onError: toggleOffUploading,
    taskName: {
      name: 'images_ocr',
      image_details: {
        image_type: 'VIN',
      } },
  });

  const handleUploadVin = useCallback((pic) => {
    setVinPicture(pic);
    upload(Platform.OS === 'web' ? pic.source.base64 : pic.source.uri, vinSight[0].id);
  }, [upload]);

  const [fakeActivity] = useFakeActivity(isLoading);
  const [uploadingFakeActivity] = useFakeActivity(uploading);
  const [ocrLoadingFakeActivity] = useFakeActivity(ocrIsLoading);

  // useEffect(() => {
  //   if (vinPicture?.source) { handleUploadVin(); }
  // }, [handleUploadVin, vinPicture]);

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
    <SafeAreaView>
      <VinGuide isOpen={guideIsOpen} handleClose={handleCloseGuide} />
      <VinForm
        inspectionId={inspectionId}
        vin={vin}
        handleOpenGuide={handleOpenGuide}
        handleOpenCamera={handleOpenVinCameraOrRetake}
        vinPicture={vinPicture}
        ocrIsLoading={ocrLoadingFakeActivity}
        isUploading={uploadingFakeActivity}
      />
    </SafeAreaView>
  );
};
