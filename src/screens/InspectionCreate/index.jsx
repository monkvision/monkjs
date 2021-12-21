import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

import { useDispatch } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useRequest from 'hooks/useRequest';
import useMediaGallery from 'hooks/useMediaGallery';
import isEmpty from 'lodash.isempty';

import { CameraView, useFakeActivity } from '@monkvision/react-native-views';
import { Button, Dialog, IconButton, Paragraph, Portal, useTheme } from 'react-native-paper';
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
  gallery: { width: Dimensions.get('window').width * 0.6, height: Dimensions.get('window').height * 0.6 },
  reloadCard: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' },
  reloadIcon: { position: 'absolute', zIndex: 100, top: 0, left: 0 },
  reloadImage: { position: 'relative', width: 200 },
});

export default () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [inspectionId, setInspectionId] = useState();
  const [pictureToSave, setPictureToSave] = useState([]);
  const [isPictureNotUploaded, setIsPictureNotUploaded] = useState([]);
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
      pictureToSave.forEach((picture) => {
        const encodedUri = encodeURI(picture.source.base64);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${Date.now()}.png`);
        document.body.appendChild(link);
        link.click();
      });
    } else {
      saveToDevice();
    }
    setPictureToSave([]);
    navigation.navigate(LANDING);
  }, [navigation, pictureToSave, saveToDevice]);

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
      setPictureToSave((prevState) => [...prevState, picture]);
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
      .then(() => {
        setUploading(false);
        setPictureToSave((prevState) => prevState.filter((pic, i) => {
          if (pic === picture) {
            isPictureNotUploaded[i] = false;
            return false;
          }
          return true;
        }));
      })
      .catch(() => {
        setUploading(false);
        if (isEmpty(pictureToSave)) {
          setIsOffline(true);
        }
        if (Platform.OS === 'web') {
          const n = pictureToSave.length;
          setIsPictureNotUploaded((prevState) => {
            const current = prevState;
            current[n] = true;
            return current;
          });
        }
      });
  }, [dispatch, inspectionId, isPictureNotUploaded, pictureToSave]);

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
          visible={isCompleted && !isEmpty(pictureToSave)}
          style={{ alignSelf: 'center' }}
        >
          <Dialog.Title style={styles.dialogContent}>
            Retry
          </Dialog.Title>
          <Dialog.Content>
            <ScrollView style={styles.gallery}>
              <View style={styles.reloadCard}>
                {pictureToSave
                  .filter((_, i) => isPictureNotUploaded[i])
                  .map((picture) => (
                    <TouchableOpacity
                      style={{ margin: 7 }}
                      onPress={() => { handleTakePicture(picture); }}
                    >
                      <IconButton
                        icon="reload"
                        size={24}
                        onPress={() => { handleTakePicture(picture); }}
                        style={{ position: 'absolute', zIndex: 100, top: 0, left: 0, backgroundColor: theme.colors.primary }}
                        color="white"
                      />
                      <Image
                        source={{ uri: Platform.OS === 'web' ? picture.source.base64 : picture.source.uri }}
                        style={{ position: 'relative', width: 200, height: (picture.source.height * 200) / picture.source.width }}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </ScrollView>
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
            <Button
              onPress={() => {
                pictureToSave
                  .filter((_, i) => isPictureNotUploaded[i])
                  .forEach((pic) => { handleTakePicture(pic); });
              }}
              mode="contained"
              style={styles.button}
            >
              Retry all pictures upload
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={isOffline}
          style={styles.dialog}
          onDismiss={() => setIsOffline(false)}
        >
          <Dialog.Title style={styles.dialogContent}>
            Upload failed
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogContent}>
              Your photo upload failed but you can continue to take photo and
              at the end you can choose if you want to save them in order to add them later
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              loading={isSaving}
              disabled={isSaving || isSaved}
              onPress={() => setIsOffline(false)}
              mode="contained"
              style={styles.button}
            >
              Continue
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={isVisibleDialog && isCompleted && !isUploading && isEmpty(pictureToSave)}
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
