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
  onDeleteDamage,
  onSelectDamage,
  onValidate,
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
            inspectionId={inspectionId}
            isDialogOpen={isDialogOpen}
            handleDismissDialog={handleDismissDialog}
            onValidate={onValidate}
            isLoading={isValidating}
          />
          <Navigation
            partsWithDamages={partsWithDamages}
            computedParts={computedParts}
            damagedPartsCount={partsWithDamages.length}
            handleOpenDialog={handleOpenDialog}
            isValidated={isValidated}
            onDeleteDamage={onDeleteDamage}
            onSelectDamage={onSelectDamage}
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
  isLoading: PropTypes.bool,
  isValidating: PropTypes.bool,
  onDeleteDamage: PropTypes.func,
  onSelectDamage: PropTypes.func,
  onValidate: PropTypes.func,
};

Damages.defaultProps = {
  inspection: {},
  isLoading: false,
  isValidating: false,
  onDeleteDamage: noop,
  onSelectDamage: noop,
  onValidate: noop,
};
