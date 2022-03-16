import { useCallback, useMemo } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Platform } from 'react-native';

import { updateOneTaskOfInspection } from '@monkvision/corejs';

import useMediaGallery from 'hooks/useMediaGallery';
import useRequest from 'hooks/useRequest';
import { INSPECTION_READ } from 'screens/names';

export default function useScreen() {
  const route = useRoute();
  const { inspectionId } = route.params;

  const navigation = useNavigation();

  const isNative = useMemo(() => Platform.select({ native: true, default: false }), []);

  const handleNext = useCallback(() => navigation.navigate(INSPECTION_READ, { inspectionId }),
    [inspectionId, navigation]);

  useFocusEffect(
    useCallback(() => () => {
      if (isNative) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
          .then(() => ScreenOrientation.unlockAsync());
      }
    }, [isNative]),
  );

  const payload = { inspectionId, taskName: 'damage_detection', data: { status: 'TODO' } };
  const callbacks = { onSuccess: handleNext };

  const {
    request,
    isLoading,
    requestCount,
  } = useRequest(updateOneTaskOfInspection(payload), callbacks, false);

  return {
    request,
    requestCount,
    isLoading,
    inspectionId,
    savePictures: useMediaGallery(),
  };
}
