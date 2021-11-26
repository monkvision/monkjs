import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
// import LandscapeIllustration from './PortraitErrorIllustration';
import useOrientation from '../../../hooks/useOrientation';
import drawing from './drawing.svg';

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

const PortraitErrorView = () => {
  const [orientation, lock] = useOrientation();

  return (
    <View style={styles.container}>
      <View style={[styles.grayBar, { width: 40, top: 20 }]} />
      <View style={[styles.grayBar, { width: 20, top: 100 }]} />

      <SvgXml xml={drawing} />

      <Text style={styles.title}>Oops </Text>
      <Text style={styles.text}>
        This feature works only on landscape orientation, please rotate your phone.
      </Text>
      {orientation && orientation !== 3 ? <Button onPress={lock}>Rotate</Button> : null}
    </View>
  );
};
export default PortraitErrorView;
