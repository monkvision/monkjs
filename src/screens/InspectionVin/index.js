import React, { useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Loader } from '@monkvision/ui';
import { Sight, values as sightValues } from '@monkvision/corejs';
import { Capture, Controls } from '@monkvision/camera';

import useVin from './hooks/useVin';
import VinForm from './VinForm';
import VinGuide from './VinGuide';

const SNACKBAR_HEIGHT = 50;

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    height: '100%',
  },
  snackbar: {
    position: 'absolute',
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
    handleCapture,
    handleOpenVinCameraOrRetake,
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

  const controls = [{
    disabled: camera.loading,
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
        loading={camera.loading}
        controls={controls}
        task={{ name: 'images_ocr', image_details: { image_type: 'VIN' } }}
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
        onAddErrorSnackbar={errorSnackbar.handleAddErrorSnackbar}
        onRenitializeInspection={createInspection}
      />

      {errorSnackbar.value?.length ? errorSnackbar.value.map((error, index) => (
        <Snackbar
          key={error.title}
          visible={errorSnackbar.value}
          onDismiss={() => errorSnackbar.handleCloseErrorSnackbar(error, index)}
          style={[
            { backgroundColor: theme.colors.error, bottom: index * SNACKBAR_HEIGHT },
            styles.snackbar]}
          action={{ label: 'Ok',
            onPress: () => errorSnackbar.handleCloseErrorSnackbar(error, index),
            labelStyle: styles.snackbarButton }}
        >
          {error.title}
        </Snackbar>
      )) : null}
    </SafeAreaView>
  );
};
