import React from 'react';
import { isEmpty, noop } from 'lodash';
import { Image, ScrollView } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import Proptypes from 'prop-types';
import styles from '../styles';
import { damagePicturesPropType } from '../proptypes';

export default function DamagePicturesViewer({ damagePictures, handleOpenPreviewDialog }) {
  return (
    <ScrollView contentContainerStyle={styles.images} horizontal>
      {!isEmpty(damagePictures) ? damagePictures?.map(({ uri }, index) => (
        <TouchableRipple
          key={String(index)}
          onPress={() => handleOpenPreviewDialog({ uri, index })}
        >
          <Image style={styles.image} source={{ uri }} />
        </TouchableRipple>
      )) : null}
    </ScrollView>
  );
}
DamagePicturesViewer.propTypes = {
  damagePictures: damagePicturesPropType,
  handleOpenPreviewDialog: Proptypes.func,
};
DamagePicturesViewer.defaultProps = {
  damagePictures: [],
  handleOpenPreviewDialog: noop,
};
