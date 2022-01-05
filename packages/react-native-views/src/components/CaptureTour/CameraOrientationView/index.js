/* eslint-disable react/no-danger */
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Proptypes from 'prop-types';
import { Button, withTheme } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';

import drawing from './drawing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  title: { textAlign: 'center', fontSize: 28, fontWeight: '500' },
  text: { textAlign: 'center', margin: 16 },
});

const PortraitErrorView = ({ rotateToLandscape, supportOrientation }) => (
  <View style={styles.container}>
    {/* TODO find better solution to render the drawing */}
    {Platform.OS === 'web'
      ? <div dangerouslySetInnerHTML={{ __html: drawing }} />
      : <SvgXml xml={drawing} />}
    <Text style={styles.text}>
      This feature works only on landscape orientation, please rotate your phone.
    </Text>
    {supportOrientation ? (
      <Button icon="phone-rotate-landscape" onPress={rotateToLandscape} mode="contained">
        Rotate
      </Button>
    ) : null}
  </View>
);

PortraitErrorView.propTypes = {
  rotateToLandscape: Proptypes.func.isRequired,
  supportOrientation: Proptypes.bool.isRequired,
};

export default withTheme(PortraitErrorView);
