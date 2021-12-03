import React, { useRef } from 'react';

import { StyleSheet, View } from 'react-native';
import { withTheme, Text } from 'react-native-paper';
import Components, { propTypes } from '@monkvision/react-native';
import useMobileBrowserConfig from '../hooks/useMobileBrowserConfig';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    maxWidth: 125,
  },
  text: {
    position: 'absolute',
    top: 0,
    width: 100,
    lineHeight: 16,
    alignSelf: 'center',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginVertical: 8,
    zIndex: 20,
  },
});

function CameraScrollView({ activeSight, pictures, sights, theme }) {
  const scrollRef = useRef();
  const onRotateToPortrait = () => scrollRef.current.setNativeProps({
    style: { height: '100%' },
  });

  useMobileBrowserConfig(onRotateToPortrait);

  return (
    <View style={styles.root}>
      <Text style={[styles.text, { color: theme.colors.accent }]}>
        {`${Object.keys(pictures).length + 1} / ${sights.length}`}
      </Text>
      <Components.PicturesScrollPreview
        activeSight={activeSight}
        pictures={pictures}
        ref={scrollRef}
        sights={sights}
      />
    </View>
  );
}

CameraScrollView.propTypes = {
  activeSight: propTypes.sight.isRequired,
  pictures: propTypes.cameraPictures.isRequired,
  sights: propTypes.sights.isRequired,
};

export default withTheme(CameraScrollView);
