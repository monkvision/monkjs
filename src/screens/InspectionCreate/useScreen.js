import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Platform } from 'react-native';
import { INSPECTION_READ } from 'screens/names';

export default function useScreen() {
  const navigation = useNavigation();

  const [inspectionId, setInspectionId] = useState();

  const [isUploading, setUploading] = useState(false);
  const [uploadHasFailed, setUploadHasFailed] = useState(false);

  const [isCompleted, setTourIsCompleted] = useState(false);
  const [isVisibleDialog, setVisibleDialog] = useState(false);
  const [isTaskUpdated, setTaskUpdated] = useState(false);

  const isNative = useMemo(() => Platform.select({ native: true, default: false }), []);

  const handleNext = useCallback(() => {
    navigation.navigate(INSPECTION_READ, { inspectionId });
  }, [inspectionId, navigation]);

  useFocusEffect(
    useCallback(() => {
      if (isCompleted) { setVisibleDialog(true); }

      return () => {
        setVisibleDialog(false);
        if (isNative) {
          ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
            .then(() => ScreenOrientation.unlockAsync());
        }
      };
    }, [isCompleted, isNative]),
  );

  return {
    state: {
      inspectionId,
      isCompleted,
      isNative,
      isTaskUpdated,
      isUploading,
      isVisibleDialog,
      uploadHasFailed,
    },
    handleNext,
    setTourIsCompleted,
    setInspectionId,
    setTaskUpdated,
    setUploading,
    setUploadHasFailed,
    setVisibleDialog,
  };
}
