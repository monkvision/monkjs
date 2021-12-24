import noop from 'lodash.noop';
import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import PartListSection from '../PartListSection';
import ValidationButton from '../ValidationButton';

export default function PartsList({
  partsWithDamages,
  handleOpenDialog,
  isValidated,
  onSelectDamage,
  onDeleteDamage,
  isLoading,
}) {
  if (!partsWithDamages) { return null; }

  return (
    <ScrollView>
      {partsWithDamages.map((part) => (
        <PartListSection
          isValidated={isValidated}
          key={`part-${part.id}`}
          onSelectDamage={onSelectDamage}
          onDeleteDamage={onDeleteDamage}
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
  partType: PropTypes.string.isRequired,
};

PartsList.defaultProps = {
  isLoading: false,
  onDeleteDamage: noop,
  onSelectDamage: noop,
  partsWithDamages: [],
};
