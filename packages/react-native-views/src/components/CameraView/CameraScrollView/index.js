import React, { useRef } from 'react';

import { StyleSheet, View } from 'react-native';
import { withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
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

function CameraScrollView({ activeSight, pictures, sightIdsNotUploaded, sights }) {
  const scrollRef = useRef();
  const onRotateToPortrait = () => scrollRef.current.setNativeProps({
    style: { height: '100%' },
  });

  useMobileBrowserConfig(onRotateToPortrait);

  return (
    <View style={styles.root}>
      <Components.PicturesScrollPreview
        activeSight={activeSight}
        pictures={pictures}
        ref={scrollRef}
        sightIdsNotUploaded={sightIdsNotUploaded}
        sights={sights}
      />
    </View>
  );
}

CameraScrollView.propTypes = {
  activeSight: propTypes.sight.isRequired,
  pictures: propTypes.cameraPictures.isRequired,
  sightIdsNotUploaded: PropTypes.string,
  sights: propTypes.sights.isRequired,
};

CameraScrollView.defaultProps = {
  sightIdsNotUploaded: [],
};

export default withTheme(CameraScrollView);
