/* eslint-disable react/prop-types */
import React, { useImperativeHandle, forwardRef } from 'react';
import { View } from 'react-native';
import { ActivityIndicatorView } from '@monkvision/react-native-views';
import { Provider as PaperProvider } from 'react-native-paper';
import useComputedParts from './useComputedParts';
import useLayout from './useLayout';
import usePartDamages from './usePartDamages';

import Navigation from './Navigation';
import ValidateDialog from './ValidateDialog';

import styles from './styles';

function Damages({
  theme,
  inspection,
  isLoading,
  isValidating,
  isDeleting,
  onDeleteDamage,
  onSelectDamage,
  onValidate,
  onPressPart,
  isVehiclePressAble,
  selectedId,
}, ref) {
  const inspectionId = inspection?.id;

  const {
    isDialogOpen,
    handleOpenDialog,
    handleDismissDialog,
    isValidated,
  } = useLayout({ inspection, inspectionId });

  const partsWithDamages = usePartDamages(inspection.damages, inspection.parts);
  const computedParts = useComputedParts(partsWithDamages);

  useImperativeHandle(ref, () => ({
    validate: handleOpenDialog,
  }));

  if (partsWithDamages.length === 0) { return null; }

  return (
    <View style={styles.root}>
      <PaperProvider theme={theme}>
        {isLoading ? <ActivityIndicatorView light /> : (
          <>
            <ValidateDialog
              isDialogOpen={isDialogOpen}
              handleDismissDialog={handleDismissDialog}
              onValidate={onValidate}
              isValidating={isValidating}
              inspectionId={inspection.id}
            />
            <Navigation
              partsWithDamages={partsWithDamages}
              computedParts={computedParts}
              damagedPartsCount={partsWithDamages.length}
              handleOpenDialog={handleOpenDialog}
              isValidated={isValidated}
              onDeleteDamage={onDeleteDamage}
              onSelectDamage={onSelectDamage}
              isDeleting={isDeleting}
              isVehiclePressAble={isVehiclePressAble && !isValidated}
              onPressPart={onPressPart}
              selectedId={selectedId}
            />
          </>
        )}
      </PaperProvider>
    </View>
  );
}

export default forwardRef(Damages);
