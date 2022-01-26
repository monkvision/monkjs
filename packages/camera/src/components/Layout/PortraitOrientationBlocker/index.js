import React from 'react';
import Proptypes from 'prop-types';
import { Button, Dimensions, Platform, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    ...Platform.select({
      native: {
        minHeight: Dimensions.get('window').height,
      },
      default: {
        minHeight: '100vh',
      },
    }),
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '500',
  },
  text: {
    textAlign: 'center',
    margin: 16,
    color: 'white',
  },
});

const PortraitOrientationBlocker = ({ grantLandscape, isPortrait }) => (
  <View style={styles.container}>
    <Text style={styles.text}>
      For a better experience please rotate your device to landscape.
    </Text>
    {!isPortrait ? (
      <Button
        onPress={grantLandscape}
        title="It's Done"
      />
    ) : null}
  </View>
);

PortraitOrientationBlocker.propTypes = {
  grantLandscape: Proptypes.func,
  isPortrait: Proptypes.bool,
};

PortraitOrientationBlocker.defaultProps = {
  // rotateToLandscape: noop,
  isPortrait: false,
  grantLandscape: () => {},
};

export default PortraitOrientationBlocker;
