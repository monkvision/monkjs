import React, {useCallback, useEffect} from 'react';
import {useSelector, useDispatch, useStore} from 'react-redux';
import {useNavigation} from "@react-navigation/native";

import { getOneInspectionById, selectInspectionById } from '@monkvision/corejs';
import { PicturesSummaryView } from '@monkvision/react-native-views';

import {GETTING_STARTED} from "../names";

export default ({ route }) => {
  const navigation = useNavigation();
  const { inspectionId, pictures, sights } = route.params;
  const dispatch = useDispatch();
  const {
    loading,
    error,
  } = useSelector((state) => state.inspections);
  const store = useStore();
  const inspection = selectInspectionById(store.getState(), inspectionId);

  const getInspection = useCallback(async () => {
    dispatch(getOneInspectionById({ id:inspectionId }));
    console.log(inspection)
    }, [dispatch]);

  const handleNextPicture = () => {
    console.log('next');
  }
  const handleSucces = () => {
    console.log('success');
    navigation.navigate(GETTING_STARTED);
  }

  useEffect(() => {
    if (loading !== 'pending' && !error) {
      dispatch(getOneInspectionById({ id: inspectionId }));
    }
  }, [dispatch, error, loading]);

  useEffect(() => {
    console.log(inspection)
  }, [inspection])

  return (
      <PicturesSummaryView
        cameraPictures={pictures}
        onNextPicture={handleNextPicture}
        onSuccess={handleSucces}
        sights={sights}
      />
  );
}
