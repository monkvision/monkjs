import React, { useEffect } from 'react';
import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import { OrientationLock, lockAsync, unlockAsync } from 'expo-screen-orientation';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import Header from './Header';
import Body from './Body';
import { styles } from './styles';

export default function VehicleTour({ onCancel, onStart }) {

  useEffect(() => {
    lockAsync(OrientationLock.LANDSCAPE_RIGHT);

    return () => {
      lockAsync(OrientationLock.PORTRAIT_UP).then(() => {
        unlockAsync();
      });
    };
  }, []);

  return (
    <View style={styles.root}>
      <Header onCancel={onCancel} progression={0.1} />
      <Body />
      <View style={styles.startButton}>
        <Button mode="contained" onPress={onStart}>Start</Button>
      </View>
    </View>
  );
}

VehicleTour.propTypes = {
  onCancel: PropTypes.func,
  onStart: PropTypes.func,
};

VehicleTour.defaultProps = {
  onCancel: noop,
  onStart: noop,
};
