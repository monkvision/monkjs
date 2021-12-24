import React from 'react';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';

import { useRoute } from '@react-navigation/native';
import usePartDamages from 'hooks/usePartDamages';

import { ActivityIndicatorView } from '@monkvision/react-native-views';

import { SafeAreaView } from 'react-native';
import Navigation from 'screens/Damages/Navigation';
import useComputedParts from 'screens/Damages/useComputedParts';
import useLayout from 'screens/Damages/useLayout';

import ValidateDialog from 'screens/Damages/ValidateDialog';

import styles from 'screens/Damages/styles';

import {
  damagesEntity,
  selectDamageEntities,
  selectInspectionEntities,
  selectImageEntities,
  selectPartEntities,
  selectTaskEntities,
  imagesEntity,
  inspectionsEntity,
  tasksEntity,
} from '@monkvision/corejs';

export default () => {
  const route = useRoute();
  const { inspectionId } = route.params;

  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const damagesEntities = useSelector(selectDamageEntities);
  const partsEntities = useSelector(selectPartEntities);
  const tasksEntities = useSelector(selectTaskEntities);

  const { inspection } = denormalize({ inspection: inspectionId }, {
    inspection: inspectionsEntity,
    images: [imagesEntity],
    damages: [damagesEntity],
    tasks: [tasksEntity],
  }, {
    inspections: inspectionEntities,
    images: imagesEntities,
    damages: damagesEntities,
    parts: partsEntities,
    tasks: tasksEntities,
  });

  const {
    fakeActivity,
    isDialogOpen, handleOpenDialog, handleDismissDialog,
    isValidated,
  } = useLayout({ inspection, inspectionId });

  const partsWithDamages = usePartDamages(inspection.damages, inspection.parts);
  const computedParts = useComputedParts(partsWithDamages);

  if (partsWithDamages.length === 0) {
    return null;
  }

  return (
    <SafeAreaView style={styles.root}>
      {fakeActivity ? <ActivityIndicatorView light /> : (
        <>
          <ValidateDialog isDialogOpen={isDialogOpen} handleDismissDialog={handleDismissDialog} />
          <Navigation
            partsWithDamages={partsWithDamages}
            computedParts={computedParts}
            damagedPartsCount={partsWithDamages.length}
            handleOpenDialog={handleOpenDialog}
            isValidated={isValidated}
          />
        </>
      )}
    </SafeAreaView>
  );
};
