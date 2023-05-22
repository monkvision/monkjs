import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { CarOrientation, CommonPropTypes, DamageMode, VehicleType } from '../../../resources';
import CarView360 from '../../CarView360';
import CarView360Handles from '../../CarView360/CarView360Handles';
import { useCarOrientation } from '../../CarView360/hooks';
import DamageCounts from './DamageCounts';
import { useDamageCounts } from './hooks';

const styles = StyleSheet.create({
  container: {},
  subContainer: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carViewContainer: {
    paddingVertical: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Overview({
  damages,
  damageMode,
  vehicleType,
  onPressPart,
  onPressPill,
}) {
  const { width } = useWindowDimensions();
  const {
    orientation,
    rotateLeft,
    rotateRight,
    setOrientation,
  } = useCarOrientation(CarOrientation.FRONT_LEFT);
  const damageCounts = useDamageCounts(damages);

  return (
    <View style={[styles.container]}>
      <DamageCounts damageMode={damageMode} counts={damageCounts} />
      <View style={[styles.carViewContainer]}>
        <View style={[styles.carViewContainer]}>
          <CarView360
            damages={damages}
            vehicleType={vehicleType}
            orientation={orientation}
            width={width - 40}
            onPressPart={onPressPart}
            onPressPill={onPressPill}
          />
        </View>
        <CarView360Handles
          orientation={orientation}
          onRotateLeft={rotateLeft}
          onRotateRight={rotateRight}
          onSelectOrientation={setOrientation}
        />
      </View>
    </View>
  );
}

Overview.propTypes = {
  damageMode: CommonPropTypes.damageMode,
  damages: PropTypes.arrayOf(CommonPropTypes.damage),
  onPressPart: PropTypes.func,
  onPressPill: PropTypes.func,
  vehicleType: CommonPropTypes.vehicleType,
};

Overview.defaultProps = {
  damageMode: DamageMode.ALL,
  damages: [],
  onPressPart: () => {},
  onPressPill: () => {},
  vehicleType: VehicleType.CUV,
};
