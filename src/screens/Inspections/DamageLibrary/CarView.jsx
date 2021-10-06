import React from 'react';
import { View, StyleSheet } from 'react-native';
import VehicleView from '@monkvision/react-native/src/components/VehicleView';
// import BackViewPart from '../../../assets/carViews/Back';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
  SvgContainer: {
    backgroundColor: 'transparent',
  },
});

export default function CarView() {
  return (
    <View style={styles.root}>
      <VehicleView xmlPath={require('assets/carViews/FrontView.svg')} />
    </View>
  );
}
