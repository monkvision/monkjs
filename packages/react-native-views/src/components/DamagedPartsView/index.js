import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash.camelcase';
import noop from 'lodash.noop';

import { Vehicle } from '@monkvision/react-native';
import vehicleViews from '../../assets/vehicle';

export default function DamagedPartsView({ partsWithDamages, viewType, pressAble, onPress }) {
  const activeParts = useMemo(
    () => {
      const object = {};
      partsWithDamages.forEach((part) => { object[camelCase(part.partType)] = true; });

      return object;
    },
    [partsWithDamages],
  );

  return (
    <Vehicle
      xml={vehicleViews[viewType]}
      activeParts={activeParts}
      pressAble={Boolean(pressAble)}
      onPress={onPress}
      width="100%"
      height="100%"
    />
  );
}

DamagedPartsView.propTypes = {
  onPress: PropTypes.func,
  partsWithDamages: PropTypes.arrayOf(PropTypes.object),
  pressAble: PropTypes.bool,
  viewType: PropTypes.oneOf(['front', 'back', 'interior']).isRequired,
};

DamagedPartsView.defaultProps = {
  partsWithDamages: [],
  pressAble: false,
  onPress: noop,
};
