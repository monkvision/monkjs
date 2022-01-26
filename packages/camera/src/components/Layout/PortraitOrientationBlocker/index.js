/* eslint-disable react/no-danger */
import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Proptypes from 'prop-types';
import { Button, withTheme } from 'react-native-paper';
import noop from 'lodash.noop';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },
  title: { textAlign: 'center', fontSize: 28, fontWeight: '500' },
  text: { textAlign: 'center', margin: 16, color: '#FFF' },
});

const PortraitOrientationBlocker = ({ grantLandscape, isPortrait }) => {
  const { height } = useWindowDimensions();
  return (
    <View style={{ minHeight: height + 100 }}>
      <View style={styles.container}>
        <Text style={styles.text}>
          For a better experience please rotate your device to landscape
        </Text>
        {!isPortrait ? (
          <Button color="#FFF" labelStyle={{ color: '#000' }} onPress={grantLandscape} mode="contained">
            Done
          </Button>
        ) : null}
      </View>
    </View>
  );
};

PortraitOrientationBlocker.propTypes = {
  grantLandscape: Proptypes.func,
  isPortrait: Proptypes.bool,
};

PortraitOrientationBlocker.defaultProps = {
  isPortrait: false,
  grantLandscape: noop,
};

export default withTheme(PortraitOrientationBlocker);
