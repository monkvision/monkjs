import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { ActivityIndicatorView } from '@monkvision/react-native-views';

import useComputedParts from './useComputedParts';
import useLayout from './useLayout';
import usePartDamages from './usePartDamages';

import Navigation from './Navigation';
import ValidateDialog from './ValidateDialog';

import styles from './styles';

export default function Damages({
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
}) {
  const inspectionId = inspection?.id;

  const {
    isDialogOpen,
    handleOpenDialog,
    handleDismissDialog,
    isValidated,
  } = useLayout({ inspection, inspectionId });

  const partsWithDamages = usePartDamages(inspection.damages, inspection.parts);
  const computedParts = useComputedParts(partsWithDamages);

  if (partsWithDamages.length === 0) { return null; }

  return (
    <SafeAreaView style={styles.root}>
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
    </SafeAreaView>
  );
}

Damages.propTypes = {
  inspection: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    damages: PropTypes.any.isRequired,
    id: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    parts: PropTypes.any.isRequired,
  }),
  isDeleting: PropTypes.bool,
  isLoading: PropTypes.bool,
  isValidating: PropTypes.bool,
  isVehiclePressAble: PropTypes.bool,
  onDeleteDamage: PropTypes.func,
  onPressPart: PropTypes.func,
  onSelectDamage: PropTypes.func,
  onValidate: PropTypes.func,
  selectedId: PropTypes.string,
};

Damages.defaultProps = {
  inspection: {},
  isLoading: false,
  isValidating: false,
  isVehiclePressAble: false,
  isDeleting: false,
  onDeleteDamage: noop,
  onSelectDamage: noop,
  onPressPart: noop,
  onValidate: noop,
  selectedId: null,
};
