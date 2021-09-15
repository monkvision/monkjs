import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import { ClassicPartsWheel } from 'components/CarMask/ClassicCar';
import useMasks from '../../hooks/useMasks';
import CarMask from '../../components/CarMask';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function CarMaskView({ style }) {
  const [maskState, maskApi] = useMasks();

  const handlePress = () => {
    maskApi.forward();
  };

  return (
    <View style={[styles.root, style]}>
      <CarMask activeMask={maskState.active} maskColor="rgba(65,255,74,0.9)" />
      <ClassicPartsWheel parts={maskState} onPress={handlePress} />
    </View>
  );
}

CarMaskView.propTypes = {
  // https://github.com/GeekyAnts/NativeBase/issues/3264
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.any, // ViewPropTypes.style,
};

CarMaskView.defaultProps = {
  style: {},
};

export default CarMaskView;
