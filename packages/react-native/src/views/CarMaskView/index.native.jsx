import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import ViewPager from 'react-native-pager-view';

import useMasks from '../../hooks/useMasks';

import { ClassicPartsWheel } from '../../components/CarMask/ClassicCar';

import ClassicFrontLeftMask from '../../components/CarMask/ClassicCar/FrontLeftMask';
import ClassicFrontMask from '../../components/CarMask/ClassicCar/FrontMask';
import ClassicFrontRightMask from '../../components/CarMask/ClassicCar/FrontRightMask';
import ClassicLateralFrontLeftMask from '../../components/CarMask/ClassicCar/LateralFrontLeftMask';
import ClassicLateralFrontRightMask from '../../components/CarMask/ClassicCar/LateralFrontRightMask';
import ClassicLateralRearLeftMask from '../../components/CarMask/ClassicCar/LateralRearLeftMask';
import ClassicLateralRearRightMask from '../../components/CarMask/ClassicCar/LateralRearRightMask';
import ClassicRearLeftMask from '../../components/CarMask/ClassicCar/RearLeftMask';
import ClassicRearMask from '../../components/CarMask/ClassicCar/RearMask';
import ClassicRearRightMask from '../../components/CarMask/ClassicCar/RearRightMask';

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

/**
 * @param maskColor {string}
 * @param style {ViewPropTypes.style}
 * @returns {JSX.Element}
 * @constructor
 */
function CarMaskView({ maskColor, style }) {
  const [maskState, maskApi] = useMasks();

  const handlePageSelected = useCallback((e) => {
    maskApi.setActive(e.nativeEvent.position);
  }, [maskApi]);

  return (
    <View style={[styles.root, style]}>
      <ClassicPartsWheel parts={maskState} />
      <ViewPager
        style={styles.viewPager}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        <View style={styles.page} key="front">
          <ClassicFrontMask color={maskColor} />
        </View>
        <View style={styles.page} key="frontRight">
          <ClassicFrontRightMask color={maskColor} />
        </View>
        <View style={styles.page} key="lateralFrontRight">
          <ClassicLateralFrontRightMask color={maskColor} />
        </View>
        <View style={styles.page} key="lateralRearRight">
          <ClassicLateralRearRightMask color={maskColor} />
        </View>
        <View style={styles.page} key="rearRight">
          <ClassicRearRightMask color={maskColor} />
        </View>
        <View style={styles.page} key="rear">
          <ClassicRearMask color={maskColor} />
        </View>
        <View style={styles.page} key="rearLeft">
          <ClassicRearLeftMask color={maskColor} />
        </View>
        <View style={styles.page} key="lateralRearLeft">
          <ClassicLateralRearLeftMask color={maskColor} />
        </View>
        <View style={styles.page} key="lateralFrontLeft">
          <ClassicLateralFrontLeftMask color={maskColor} />
        </View>
        <View style={styles.page} key="frontLeft">
          <ClassicFrontLeftMask color={maskColor} />
        </View>
      </ViewPager>
    </View>
  );
}

CarMaskView.propTypes = {
  maskColor: PropTypes.string,
  // https://github.com/GeekyAnts/NativeBase/issues/3264
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.any, // ViewPropTypes.style,
};

CarMaskView.defaultProps = {
  maskColor: 'rgba(65,255,74,0.9)',
  style: {},
};

export default CarMaskView;
