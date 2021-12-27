import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import useUpload from 'hooks/useUpload';
import UploadFailureDialog from 'screens/InspectionCreate/UploadFailureDialog';
import useRequests from 'screens/InspectionCreate/useRequests';
import useScreen from 'screens/InspectionCreate/useScreen';

import { Platform } from 'react-native';
import { CameraView, useFakeActivity } from '@monkvision/react-native-views';
import ValidationDialog from 'screens/InspectionCreate/ValidationDialog';

import { GETTING_STARTED } from 'screens/names';

export default () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const screen = useScreen();
  const requests = useRequests(screen);

  const { inspectionId } = screen.state;
  const trueActivity = requests.createInspection.isLoading || screen.state.isUploading;
  const [fakeActivity] = useFakeActivity(trueActivity);

  const handleSuccess = useCallback(({ camera, pictures }) => {
    camera.pausePreview();
    screen.setTourIsCompleted(true);
    screen.setVisibleDialog(true);
    requests.savePictures.preparePictures(pictures);
  }, [requests.savePictures, screen]);

  const handleClose = useCallback(() => {
    navigation.navigate(GETTING_STARTED);
  }, [navigation]);

  const handleTakePicture = useUpload({
    inspectionId,
    onSuccess: () => screen.setUploading(false),
    onLoading: () => screen.setUploading(true),
    onError: () => {
      screen.setUploading(false);
      screen.setUploadHasFailed(true);
    },
  });

  return (
    <>
      <CameraView
        isLoading={fakeActivity}
        onTakePicture={(picture) => {
          if (!screen.state.uploadHasFailed) {
            handleTakePicture(
              Platform.OS === 'web'
                ? picture.source.base64
                : picture.source.uri,
              inspectionId,
            );
          }
        }}
        onSuccess={handleSuccess}
        onCloseCamera={handleClose}
        theme={theme}
      />
      <ValidationDialog requests={requests} screen={screen} />
      <UploadFailureDialog isVisible={screen.state.uploadHasFailed} />
    </>
  );
};
