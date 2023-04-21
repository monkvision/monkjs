import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, StyleSheet, View, Image, Pressable, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import Thumbnail from './common/Thumbnail';

const styles = StyleSheet.create({
  container: {
    alignContent: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 15,
  },
  thumbnailWrapper: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  closeButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#fff',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 20,
  },
});

function Gallery({ pictures }) {
  const { t } = useTranslation();
  const [focusedPhoto, setFocusedPhoto] = useState(null);

  const handleOnImageClick = useCallback((focusedImage) => {
    if (focusedImage.url) {
      setFocusedPhoto(focusedImage);
    }
  }, [focusedPhoto]);

  const handleUnfocusPhoto = useCallback(() => {
    setFocusedPhoto(null);
  }, []);

  return (
    <View style={styles.container}>
      {
        pictures.map((image, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <View style={styles.thumbnailWrapper} key={`${image.url}-${index}`}>
            <Thumbnail image={image} click={handleOnImageClick} />
          </View>
        ))
      }

      <Modal
        animationType="slide"
        transparent
        visible={!!focusedPhoto}
        onRequestClose={handleUnfocusPhoto}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.closeButtonWrapper}>
            <Text style={styles.header}>{t(`gallery.parts.${focusedPhoto?.label}`)}</Text>
            <Pressable
              onPress={() => setFocusedPhoto(null)}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <MaterialIcons
                name="close"
                size={32}
                color="#757575"
                style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
              />
            </Pressable>
          </View>
          <Image
            source={{
              width: '100%',
              height: '100%',
              uri: focusedPhoto?.url,
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

Gallery.propTypes = {
  pictures: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
};

Gallery.defaultProps = {
  pictures: [],
};

export default Gallery;
