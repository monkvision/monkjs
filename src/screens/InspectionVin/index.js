import React, { useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';

import { ActivityIndicatorView, CameraView } from '@monkvision/react-native-views';
import { Sight, values as sightValues } from '@monkvision/corejs';

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
const vinSight = Object.values(sightValues.sights.abstract).map((s) => new Sight(...s)).filter((item) => item.id === 'vin');

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setInspectionId(null);
      vin.setPicture(null);
      createInspection();
    });

    return unsubscribe;
  }, [createInspection, navigation, setInspectionId, vin]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Inspection VIN',
      });
    }
  }, [navigation]);

  if (inspectionIsLoading) { return <ActivityIndicatorView light />; }

  if (camera.value) {
    return (
      <CameraView
        sights={vinSight}
        isLoading={inspectionIsLoading}
        onTakePicture={(pic) => handleUploadVin(pic)}
        onSuccess={handleCloseVinCamera}
        onCloseCamera={camera.handleToggleOff}
        theme={theme}
      />
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <VinGuide isOpen={guide.value} onClose={guide.handleToggleOff} />
      <VinForm
        inspectionId={inspectionId}
        vin={vin.value}
        status={status}
        onOpenGuide={guide.handleToggleOn}
        onOpenCamera={handleOpenVinCameraOrRetake}
        vinPicture={vin.picture}
        ocrIsLoading={!!ocrIsLoading}
        isUploading={!!isUploading}
        requiredFields={requiredFields}
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
