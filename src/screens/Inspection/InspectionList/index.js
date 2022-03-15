import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { denormalize } from 'normalizr';

import { useRequestState } from '@monkvision/toolkit';
import monk from '@monkvision/corejs';

import { SafeAreaView, ScrollView } from 'react-native';
import { Loader } from '@monkvision/ui';

import styles from './styles';

const entity = monk.entity.inspection;
const slice = monk.slices.inspection;

export default () => {
  const dispatch = useDispatch();
  const [inspectionIds, setInspectionIds] = useState([]);

  const getManyInspections = useCallback(async () => entity.getMany({
    params: {
      limit: 10,
      inspectionStatus: 'DONE',
      showDeleted: false,
    },
  }), []);

  const handleRequestSuccess = useCallback(({ entities, result }) => {
    setInspectionIds(result);
    dispatch(slice.actions[`inspections/gotMany`]({ entities, result }));
    dispatch(monk.slices.image.actions[`images/gotMany`]({
      entities,
      result: Object.keys(entities.images),
    }));
  }, [dispatch]);

  const [manyInspections] = useRequestState(getManyInspections, handleRequestSuccess);

  const inspectionEntities = useSelector(entity.selectors.selectEntities);
  const imageEntities = useSelector(monk.entity.image.selectors.selectEntities);

  const { inspections } = denormalize(
    { inspections: inspectionIds },
    { inspections: [monk.schemas.inspection] },
    { inspections: inspectionEntities, images: imageEntities },
  );

  // eslint-disable-next-line no-console
  console.log(inspections);

  if (manyInspections.error) {
    // eslint-disable-next-line no-console
    console.error(manyInspections.error);
  }

  if (manyInspections.loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView />
    </SafeAreaView>
  );
};
