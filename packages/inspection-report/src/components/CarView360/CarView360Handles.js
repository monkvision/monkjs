import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { IconChevronLeft, IconChevronRight } from '../../assets';
import { CarOrientation, CommonPropTypes } from '../../resources';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 56,
    height: 56,
    borderRadius: 999,
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B1B1F',
  },
  dotContainer: {
    paddingHorizontal: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    marginHorizontal: 5,
    width: 6,
    height: 6,
    backgroundColor: '#5E5E62',
    borderRadius: 999,
    cursor: 'pointer',
  },
  selectedDot: {
    transform: { scale: 1.5 },
    backgroundColor: '#FFFFFF',
  },
});

const dotOrientations = [
  CarOrientation.FRONT_LEFT,
  CarOrientation.REAR_LEFT,
  CarOrientation.REAR_RIGHT,
  CarOrientation.FRONT_RIGHT,
];

export default function CarView360Handles({
  orientation,
  onRotateLeft,
  onRotateRight,
  onSelectOrientation,
}) {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity style={[styles.handle]} onPress={onRotateLeft}>
        <IconChevronLeft />
      </TouchableOpacity>
      <View style={[styles.dotContainer]}>
        {dotOrientations.map((dotOrientation) => (
          <TouchableOpacity
            key={dotOrientation}
            style={[
              styles.dot,
              orientation === dotOrientation ? styles.selectedDot : null,
            ]}
            onPress={() => onSelectOrientation(dotOrientation)}
          />
        ))}
      </View>
      <TouchableOpacity style={[styles.handle]} onPress={onRotateRight}>
        <IconChevronRight />
      </TouchableOpacity>
    </View>
  );
}

CarView360Handles.propTypes = {
  onRotateLeft: PropTypes.func,
  onRotateRight: PropTypes.func,
  onSelectOrientation: PropTypes.func,
  orientation: CommonPropTypes.carOrientation,
};

CarView360Handles.defaultProps = {
  onRotateLeft: () => {},
  onRotateRight: () => {},
  onSelectOrientation: () => {},
  orientation: CarOrientation.FRONT_LEFT,
};
