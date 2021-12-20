import React, { useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

import { useDispatch } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useRequest from 'hooks/useRequest';
import useMediaGallery from 'hooks/useMediaGallery';

import { CameraView, useFakeActivity } from '@monkvision/react-native-views';
import { Button, Dialog, Paragraph, Portal, useTheme } from 'react-native-paper';
import Drawing from 'components/Drawing';

import { GETTING_STARTED, INSPECTION_READ, LANDING } from 'screens/names';

import {
  createOneInspection,
  addOneImageToInspection,
  updateOneTaskOfInspection,
  config,
} from '@monkvision/corejs';

import completing from './assets/undraw_order_confirmed_re_g0if.svg';

const initialInspectionData = { tasks: { damage_detection: { status: 'NOT_STARTED' } } };

const styles = StyleSheet.create({
  dialog: {
    maxWidth: 450,
    alignSelf: 'center',
    padding: 12,
  },
  dialogDrawing: { display: 'flex', alignItems: 'center' },
  dialogContent: { textAlign: 'center' },
  dialogActions: { flexWrap: 'wrap' },
  button: { width: '100%', marginVertical: 4 },
});

export default () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [inspectionId, setInspectionId] = useState();
  const [pictureToSave, setPictureToSave] = useState();
  const [isUploading, setUploading] = useState(false);
  const [isCompleted, setCompleted] = useState(false);
  const [isVisibleDialog, setVisible] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [taskUpdated, setTaskUpdated] = useState(false);

  const { isLoading } = useRequest(
    createOneInspection({ data: initialInspectionData }),
    { onSuccess: ({ result }) => setInspectionId(result), onError: () => console.log('error') },
  );

  const { isLoading: isSaving, isSaved, saveToDevice, preparePictures } = useMediaGallery();

  const handleNext = useCallback(() => {
    navigation.navigate(INSPECTION_READ, { inspectionId });
  }, [inspectionId, navigation]);

  const { isLoading: isValidating, request: updateTask } = useRequest(
    updateOneTaskOfInspection({
      inspectionId,
      taskName: 'damage_detection',
      data: { status: 'TODO' },
    }),
    {
      onSuccess: () => {
        setTaskUpdated(true);
        handleNext();
      },
    },
    false,
  );

  const [fakeActivity] = useFakeActivity(isLoading || isUploading);

  const isNative = useMemo(
    () => Platform.select({ native: true, default: false }),
    [],
  );

  const handleSuccess = useCallback(({ camera, pictures }) => {
    camera.pausePreview();
    setCompleted(true);
    setVisible(true);
    preparePictures(pictures);
  }, [preparePictures]);

  const handleValidate = useCallback(() => {
    updateTask();
  }, [updateTask]);

  const handleSavePictures = useCallback(() => {
    // allows the user to download the picture
    if (Platform.OS === 'web' && pictureToSave) {
      const encodedUri = encodeURI(pictureToSave);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${Date.now()}.png`);
      document.body.appendChild(link);
      link.click();
      setIsOffline(false);
    } else {
      saveToDevice();
    }
  }, [pictureToSave, saveToDevice]);

  const handleClose = useCallback(() => {
    navigation.navigate(GETTING_STARTED);
  }, [navigation]);

  const handleTakePicture = useCallback(async (picture) => {
    if (!inspectionId) { return; }

    setUploading(true);

    const filename = `${picture.sight.id}-${inspectionId}.jpg`;
    const multiPartKeys = { image: 'image', json: 'json', filename, type: 'image/jpg' };

    const headers = { ...config.axiosConfig, 'Content-Type': 'multipart/form-data' };
    const baseParams = { inspectionId, headers };

    const acquisition = { strategy: 'upload_multipart_form_keys', file_key: multiPartKeys.image };
    const json = JSON.stringify({ acquisition, tasks: ['damage_detection'] });

    const data = new FormData();
    data.append(multiPartKeys.json, json);

    if (Platform.OS === 'web') {
      const response = await fetch(picture.source.base64);
      const blob = await response.blob();
      const file = await new File([blob], multiPartKeys.filename, { type: multiPartKeys.type });
      data.append(multiPartKeys.image, file);
    } else {
      data.append('image', {
        uri: picture.source.uri,
        name: multiPartKeys.filename,
        type: multiPartKeys.type,
      });
    }

    dispatch(addOneImageToInspection({ ...baseParams, data })).unwrap()
      .then(() => setUploading(false))
      .catch(() => {
        setUploading(false);
        setIsOffline(true);
        if (Platform.OS === 'web') {
          setPictureToSave(picture.source.base64);
        }
      });
  }, [dispatch, inspectionId]);

  useFocusEffect(
    useCallback(() => {
      if (isCompleted) { setVisible(true); }

      return () => {
        setVisible(false);
        if (isNative) {
          ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
            .then(() => ScreenOrientation.unlockAsync());
        }
      };
    }, [isCompleted, isNative]),
  );

  return (
    <>
      <CameraView
        isLoading={fakeActivity}
        onTakePicture={handleTakePicture}
        onSuccess={handleSuccess}
        onCloseCamera={handleClose}
        theme={theme}
      />
      <Portal>
        <Dialog
          visible={isOffline}
          style={styles.dialog}
          onDismiss={() => navigation.navigate(LANDING)}
        >
          <Dialog.Title style={styles.dialogContent}>
            Upload failed
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogContent}>
              Your photo upload failed. Do you want to save it so you can add it later?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              icon={isSaving || isSaved ? undefined : 'download'}
              loading={isSaving}
              disabled={isSaving || isSaved}
              onPress={handleSavePictures}
              mode="outlined"
              style={styles.button}
            >
              { isSaved ? 'Photos Saved !' : 'Save in device' }
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={isVisibleDialog && isCompleted && !isUploading}
          style={styles.dialog}
          onDismiss={() => navigation.navigate(LANDING)}
        >
          <View style={styles.dialogDrawing}>
            <Drawing xml={completing} width="200" height="75" />
          </View>
          <Dialog.Title style={styles.dialogContent}>
            All images are uploaded
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogContent}>
              Would you like to start the analyze ?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            {Platform.OS !== 'web' && (
              <Button
                icon={isSaving || isSaved ? undefined : 'download'}
                loading={isSaving}
                disabled={isSaving || isSaved}
                onPress={handleSavePictures}
                mode="outlined"
                style={styles.button}
              >
                { isSaved ? 'Photos Saved !' : 'Save in device' }
              </Button>
            )}
            {taskUpdated ? (
              <Button
                onPress={handleNext}
                mode="contained"
                labelStyle={{ color: 'white' }}
                color={theme.colors.success}
                style={styles.button}
              >
                See inspection
              </Button>
            ) : (
              <Button
                icon={isValidating ? undefined : 'eye-circle-outline'}
                onPress={handleValidate}
                loading={isValidating}
                disabled={isValidating}
                mode="contained"
                labelStyle={{ color: 'white' }}
                color={theme.colors.success}
                style={styles.button}
              >
                Analyze with AI
              </Button>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
