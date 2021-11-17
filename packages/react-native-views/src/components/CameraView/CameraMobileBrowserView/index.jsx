import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LandscapeIllustration from './PortraitErrorIllustration';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grayBar: {
    backgroundColor: '#E6E6E6',
    borderRadius: 30,
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
    height: 200,
    right: 0,
  },
  title: { textAlign: 'center', fontSize: 28, fontWeight: '500' },
  text: { textAlign: 'center', margin: 16 },
});
const PortraitErrorView = () => (
  <View style={styles.container}>
    <View style={[styles.grayBar, { width: 40, top: 20 }]} />
    <View style={[styles.grayBar, { width: 20, top: 100 }]} />

    <Text style={styles.title}>Oops </Text>
    <Text style={styles.text}>
      This feature works only on landscape orientation, please rotate your phone.
    </Text>
    <LandscapeIllustration />
  </View>
);
export default PortraitErrorView;
