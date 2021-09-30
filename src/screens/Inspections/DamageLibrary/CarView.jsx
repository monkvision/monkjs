import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Svg, {
  // Image,
  SvgUri,
} from 'react-native-svg';
import BackViewPart from '../../../assets/carViews/Back';

const dimensions = Dimensions.get('screen');
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
      {/*
      <Svg width="100%" height="100%" viewBox="0 0 100 100" style={styles.SvgContainer}>
        <Image height={100} width={100} href={require('../../../assets/carViews/backBig.png')} />
      </Svg>
      */}
      <Svg width="100%" height="100%" viewBox="0 0 100 100" style={styles.SvgContainer}>
        <BackViewPart partName="bumper_rear" />
      </Svg>
    </View>
  );
}
