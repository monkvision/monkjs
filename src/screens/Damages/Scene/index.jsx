import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { DamagedPartsView } from '@monkvision/react-native-views';

import styles from 'screens/Damages/styles';

export default function Scene({ partsWithDamages, viewType }) {
  return (
    <ScrollView contentContainerStyle={styles.scene}>
      <DamagedPartsView
        viewType={viewType}
        partsWithDamages={partsWithDamages}
      />
    </ScrollView>
  );
}

Scene.propTypes = {
  partsWithDamages: PropTypes.arrayOf(PropTypes.object),
  viewType: PropTypes.oneOf(['front', 'back', 'interior']).isRequired,
};

Scene.defaultProps = {
  partsWithDamages: [],
};
