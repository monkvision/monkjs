import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { getOneInspectionById } from '@monkvision/corejs';
import { propTypes } from '@monkvision/react-native';
import { PicturesSummaryView } from '@monkvision/react-native-views';

import { LANDING } from 'screens/names';

export default function InspectionReview({ route }) {
  const navigation = useNavigation();
  const { inspectionId, pictures, sights } = route.params;

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.inspections);

  const handleSuccess = () => {
    navigation.navigate(LANDING);
  };

  useEffect(() => {
    if (loading !== 'pending' && !error) {
      dispatch(getOneInspectionById({ id: inspectionId }));
    }
  }, [dispatch, error, inspectionId, loading]);

  return (
    <PicturesSummaryView
      cameraPictures={pictures}
      onSuccess={handleSuccess}
      sights={sights}
    />
  );
}

InspectionReview.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      inspectionId: PropTypes.string,
      pictures: propTypes.cameraPictures,
      sights: propTypes.sights,
    }),
  }).isRequired,
};
