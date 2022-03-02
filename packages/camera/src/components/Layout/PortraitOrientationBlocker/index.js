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

export default function PortraitOrientationBlocker({ grantLandscape, isPortrait, title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        For a better experience please rotate your device to landscape.
      </Text>
      {!isPortrait ? (
        <Button
          onPress={grantLandscape}
          title={title}
        />
      ) : null}
    </View>
  );
}

PortraitOrientationBlocker.propTypes = {
  grantLandscape: Proptypes.func,
  isPortrait: Proptypes.bool,
  title: Proptypes.string,
};

PortraitOrientationBlocker.defaultProps = {
  isPortrait: false,
  grantLandscape: () => {},
  title: 'Ready',
};
