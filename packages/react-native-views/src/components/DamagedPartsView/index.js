import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash.camelcase';

import { Vehicle } from '@monkvision/react-native';
import vehicleViews from '../../assets/vehicle';

export default function DamagedPartsView({ partsWithDamages, viewType }) {
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
      pressAble={false}
      width="100%"
      height="100%"
    />
  );
}

DamagedPartsView.propTypes = {
  partsWithDamages: PropTypes.arrayOf(PropTypes.object),
  viewType: PropTypes.oneOf(['front', 'back', 'interior']).isRequired,
};

DamagedPartsView.defaultProps = {
  partsWithDamages: [],
};
