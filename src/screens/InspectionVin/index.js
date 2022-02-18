import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Loader } from '@monkvision/ui';
import { Sight, values as sightValues } from '@monkvision/corejs';
import { Capture, Controls } from '@monkvision/camera';

import useVin from './hooks/useVin';
import VinForm from './VinForm';
import VinGuide from './VinGuide';

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

// picking the vin sight
const vinSight = Object.values(sightValues.sights.abstract)
  .map((s) => new Sight(...s))
  .filter((item) => item.id === 'vin');

export default () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const {
    vin,
    status,
    requiredFields,
    handleUploadVin,
    handleOpenVinCameraOrRetake,
    handleCloseVinCamera,
    inspectionIsLoading,
    isUploading,
    ocrIsLoading,
    createInspection,
    setInspectionId,
    inspectionId,
    guide,
    camera,
    errorSnackbar,
  } = useVin({ vinSight });

  const [loading, setLoading] = useState();

  const handleCapture = useCallback(async (state, api, event) => {
    event.preventDefault();
    setLoading(true);

    const { takePictureAsync } = api;

    setTimeout(async () => {
      const picture = await takePictureAsync();
      await handleUploadVin(picture);

      setLoading(false);
      handleCloseVinCamera();
    }, 200);
  }, [handleCloseVinCamera, handleUploadVin]);

  const controls = [{
    disabled: loading,
    onPress: handleCapture,
    ...Controls.CaptureButtonProps,
  }];

  useEffect(() => navigation.addListener('focus', () => {
    setInspectionId(null);
    vin.setPicture(null);
    createInspection();
  }), [createInspection, navigation, setInspectionId, vin]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Inspection VIN',
      });
    }
  }, [navigation]);

  if (inspectionIsLoading) { return <Loader texts={['Creating a new inspection...', 'Getting AI ready for it...', 'Loading...']} />; }

  if (camera.value) {
    return (
      <Capture
        inspectionId={inspectionId}
        sightIds={['sLu0CfOt']}
        loading={loading}
        controls={controls}
      />
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <VinGuide isOpen={guide.value} onClose={guide.handleToggleOff} />
      <VinForm
        inspectionId={inspectionId}
        vin={vin.value}
        vinPicture={vin.picture}
        status={status}
        requiredFields={requiredFields}
        ocrIsLoading={!!ocrIsLoading}
        isUploading={!!isUploading}
        onOpenGuide={guide.handleToggleOn}
        onOpenCamera={handleOpenVinCameraOrRetake}
        onOpenErrorSnackbar={errorSnackbar.handleToggleOn}
        onRenitializeInspection={createInspection}
      />
      <Snackbar
        visible={errorSnackbar.value}
        onDismiss={errorSnackbar.handleToggleOff}
        style={[{ backgroundColor: theme.colors.error }, styles.snackbar]}
        action={{ label: 'Ok', onPress: errorSnackbar.handleToggleOff, labelStyle: styles.snackbarButton }}
      >
        Request failed, please try again.
      </Snackbar>
    </SafeAreaView>
  );
};
