import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import PartListSection from 'screens/Damages/PartListSection';
import ValidationButton from 'screens/Damages/ValidationButton';

export default function PartsList({ partsWithDamages, handleOpenDialog, isValidated }) {
  if (!partsWithDamages) { return null; }

  return (
    <ScrollView>
      {partsWithDamages.map((part) => (
        <PartListSection isValidated={isValidated} key={`part-${part.id}`} {...part} />
      ))}
      <ValidationButton onPress={handleOpenDialog} isValidated={isValidated} />
    </ScrollView>
  );
}

PartsList.propTypes = {
  handleOpenDialog: PropTypes.func.isRequired,
  isValidated: PropTypes.bool.isRequired,
  partsWithDamages: PropTypes.arrayOf(PropTypes.object),
};

PartsList.defaultProps = {
  partsWithDamages: [],
};
