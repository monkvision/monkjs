import React from 'react';
import { ScrollView, Image, View, Dimensions, TouchableOpacity } from 'react-native';

import { utils } from '@monkvision/react-native';

import { damagePicturesPropType } from '../proptypes';
import styles from '../styles';

const { height } = Dimensions.get('window');
const spacing = utils.styles.spacing;

export default function DamagePicturesCameraPreview({ damagePictures, ...props }) {
  if (!damagePictures?.length) { return null; }
  return (

    <ScrollView style={styles.cameraPreviewLayout}>
      <View style={{ height: damagePictures?.length * (100 + spacing(2)) || height }}>
        {damagePictures.map(
          ({ uri }, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <TouchableOpacity key={`img-${index}`} {...props}>
              <Image
                source={{ uri }}
                style={styles.cameraPreviewImage}
                width={100}
                height={100}
              />
            </TouchableOpacity>
          ),
        )}
      </View>
    </ScrollView>
  );
}
DamagePicturesCameraPreview.propTypes = {
  damagePictures: damagePicturesPropType,
};
DamagePicturesCameraPreview.defaultProps = {
  damagePictures: [],
};
