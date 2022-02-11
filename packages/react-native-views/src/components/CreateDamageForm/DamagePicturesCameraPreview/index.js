import React from 'react';
import { ScrollView, Image, View, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';

import { utils } from '@monkvision/toolkit';

import noop from 'lodash.noop';
import PropTypes from 'prop-types';
import { damagePicturesPropType } from '../proptypes';

const spacing = utils.styles.spacing;

const styles = StyleSheet.create({
  cameraPreviewLayout: {
    backgroundColor: 'black',
    width: 125,
  },
  cameraPreviewImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreviewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginVertical: spacing(1),
  },
});

export default function DamagePicturesCameraPreview({ damagePictures, onPress, ...props }) {
  const { height } = useWindowDimensions();
  return (
    <ScrollView style={[styles.cameraPreviewLayout, { height }]}>
      <View style={[styles.cameraPreviewImageContainer,
        { height: damagePictures?.length ? (damagePictures.length * (100 + spacing(2))) : height }]}
      >
        {damagePictures?.length ? damagePictures.map(
          ({ uri }, index) => (
            <TouchableOpacity
            // eslint-disable-next-line react/no-array-index-key
              key={`img-${index}`}
              onPress={() => onPress({ uri, index })}
              {...props}
            >
              <Image
                source={{ uri }}
                style={styles.cameraPreviewImage}
                width={100}
                height={100}
              />
            </TouchableOpacity>
          ),
        ) : null}
      </View>
    </ScrollView>
  );
}
DamagePicturesCameraPreview.propTypes = {
  damagePictures: damagePicturesPropType,
  onPress: PropTypes.func,
};
DamagePicturesCameraPreview.defaultProps = {
  damagePictures: [],
  onPress: noop,
};
