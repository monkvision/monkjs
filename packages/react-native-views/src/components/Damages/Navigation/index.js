import noop from 'lodash.noop';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BottomNavigation } from 'react-native-paper';
import PartsList from '../PartList';
import Scene from '../Scene';

export default function Navigation({
  damagedPartsCount,
  computedParts,
  handleOpenDialog,
  onDeleteDamage,
  onSelectDamage,
  isValidated,
  isDeleting,
  ...props
}) {
  const [index, setIndex] = useState(0);
  const disabled = damagedPartsCount === 0;
  const badge = (nb) => nb > 0 && nb;

  const [routes] = useState([
    { key: 'front', title: 'Front', icon: 'car', badge: badge(computedParts.front) },
    { key: 'back', title: 'Back', icon: 'car-back', badge: badge(computedParts.back) },
    { key: 'interior', title: 'Interior', icon: 'car-seat', badge: badge(computedParts.interior) },
    { key: 'list', title: 'List of all', icon: 'format-list-text', badge: badge(damagedPartsCount), disabled },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    front: () => <Scene viewType="front" handleOpenDialog={handleOpenDialog} {...props} />,
    back: () => <Scene viewType="back" handleOpenDialog={handleOpenDialog} {...props} />,
    interior: () => <Scene viewType="interior" handleOpenDialog={handleOpenDialog} {...props} />,
    list: () => (
      <PartsList
        isValidated={isValidated}
        handleOpenDialog={handleOpenDialog}
        onDeleteDamage={onDeleteDamage}
        isDeleting={isDeleting}
        onSelectDamage={onSelectDamage}
        {...props}
      />
    ),
  });

  return (
    <BottomNavigation
      barStyle={{ backgroundColor: '#fff' }}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

Navigation.propTypes = {
  computedParts: PropTypes.shape({
    back: PropTypes.number,
    front: PropTypes.number,
    interior: PropTypes.number,
  }).isRequired,
  damagedPartsCount: PropTypes.number,
  handleOpenDialog: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
  isValidated: PropTypes.bool,
  onDeleteDamage: PropTypes.func,
  onSelectDamage: PropTypes.func,
};

Navigation.defaultProps = {
  damagedPartsCount: 0,
  isValidated: false,
  isDeleting: false,
  onDeleteDamage: noop,
  onSelectDamage: noop,
};
