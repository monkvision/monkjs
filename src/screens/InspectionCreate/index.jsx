import { selectInspectionById } from '@monkvision/corejs/src';
import React, { useCallback, useEffect } from 'react';

import { CameraView } from '@monkvision/react-native-views';
import { createOneInspection } from '@monkvision/corejs';

import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { DAMAGE_LIBRARY, GETTING_STARTED } from 'screens/names';

const initialInspectionData = {
  tasks: {
    damage_detection: {
      status: 'NOT_STARTED',
    },
  },
};

export default () => {
  const navigation = useNavigation();

  const store = useStore();
  const dispatch = useDispatch();

  const {
    loading,
    freshlyCreated,
    error,
  } = useSelector((state) => state.inspections);

  const inspection = selectInspectionById(store.getState(), freshlyCreated);

  // eslint-disable-next-line no-console
  console.log(inspection);

  const handleSuccess = useCallback((payload) => {
    // eslint-disable-next-line no-console
    console.log(payload);
    navigation.navigate(DAMAGE_LIBRARY, { inspectionId: inspection?.id });

    // Use API to get predictions
  }, [inspection?.id, navigation]);

  const handleClose = useCallback(() => {
    navigation.navigate(GETTING_STARTED);
  }, [navigation]);

  const handleTakePicture = useCallback((picture) => {
    // eslint-disable-next-line no-console
    console.log(picture);
  }, []);

  useEffect(() => {
    if (loading !== 'pending' && freshlyCreated === null && !error) {
      dispatch(createOneInspection({ data: initialInspectionData }));
    }
  }, [dispatch, error, freshlyCreated, loading]);

  return (
    <CameraView
      isLoading={loading === 'pending'}
      onTakePicture={handleTakePicture}
      onSuccess={handleSuccess}
      onCloseCamera={handleClose}
    />
  );
};
