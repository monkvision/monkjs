import * as ScreenOrientation from 'expo-screen-orientation';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

import style from './style';
import Header from './Header';
import Body from './Body';

export default function VehicleTour({ onCancel, onStart, progression }) {
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).then(() => {
        ScreenOrientation.unlockAsync();
      });
    };
  }, []);

  return (
    <View style={style.root}>
      <Header onCancel={onCancel} progression={progression} />
      <Body />
      <View style={style.startButton}>
        <Button mode="contained" onPress={onStart}>Start</Button>
      </View>
    </View>
  );
}
VehicleTour.propTypes = {
  onCancel: PropTypes.func,
  onStart: PropTypes.func,
  progression: PropTypes.number,
};
VehicleTour.defaultProps = {
  onCancel: () => null,
  onStart: () => null,
  progression: 0,
};
