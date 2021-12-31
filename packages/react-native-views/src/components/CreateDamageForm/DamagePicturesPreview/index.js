import React from 'react';
import { isEmpty, noop } from 'lodash';
import { Image, ScrollView, StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import Proptypes from 'prop-types';
import { utils } from '@monkvision/react-native';
import { damagePicturesPropType } from '../proptypes';

const spacing = utils.styles.spacing;
const styles = StyleSheet.create({
  images: {
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'row',
    flexShrink: 0,
    flexWrap: 'nowrap',
    marginBottom: spacing(2),
    marginHorizontal: spacing(1),
  },
  image: {
    flex: 1,
    width: 400,
    height: 300,
    marginHorizontal: spacing(1),
  },
});
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
