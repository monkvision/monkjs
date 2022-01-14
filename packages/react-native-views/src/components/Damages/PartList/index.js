import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';
import noop from 'lodash.noop';

import PartListSection from '../PartListSection';
import ValidationButton from '../ValidationButton';

import { spacing } from '../../../theme';

const styles = StyleSheet.create({
  root: {
    marginTop: spacing(2),
  },
});

export default function PartsList({
  partsWithDamages,
  handleOpenDialog,
  isValidated,
  onSelectDamage,
  isLoading,
}) {
  if (!partsWithDamages) { return null; }

  return (
    <ScrollView containerStyle={styles.root}>
      {partsWithDamages.map((part) => (
        <PartListSection
          isValidated={isValidated}
          key={`part-${part.id}`}
          onSelectDamage={onSelectDamage}
          isLoading={isLoading}
          {...part}
        />
      ))}
      <ValidationButton
        onPress={handleOpenDialog}
        isValidated={isValidated}
      />
    </ScrollView>
  );
}

PartsList.propTypes = {
  handleOpenDialog: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isValidated: PropTypes.bool.isRequired,
  onDeleteDamage: PropTypes.func,
  onSelectDamage: PropTypes.func,
  partsWithDamages: PropTypes.arrayOf(PropTypes.object),
};

PartsList.defaultProps = {
  isLoading: false,
  onDeleteDamage: noop,
  onSelectDamage: noop,
  partsWithDamages: [],
};
