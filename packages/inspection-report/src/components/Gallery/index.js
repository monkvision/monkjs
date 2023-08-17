import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, StyleSheet, View, Pressable, Text, ImageBackground, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import Thumbnail from './Thumbnail';

const styles = StyleSheet.create({
  container: {
    alignContent: 'flex-start',
    flex: 1,
    ...Platform.select({
      web: {
        flexDirection: 'row',
      },
    }),
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 15,
    overflowY: 'scroll',
  },
  messageContainer: {
    alignItems: 'center',
  },
  message: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
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
    position: 'absolute',
    top: 0,
    right: 0,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    backgroundColor: '#00000080',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    ...Platform.select({
      native: { paddingTop: 50 },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 999,
    ...Platform.select({
      native: { paddingTop: 50 },
    }),
  },
});

function Gallery({ pictures }) {
  const { i18n, t } = useTranslation();
  const [focusedPhoto, setFocusedPhoto] = useState(null);

  const handleOnImageClick = useCallback((focusedImage) => {
    if (focusedImage.url) {
      setFocusedPhoto(focusedImage);
    }
  }, [focusedPhoto]);

  const handleUnfocusPhoto = useCallback(() => {
    setFocusedPhoto(null);
  }, []);

  const renderList = useCallback(() => {
    if (Platform.OS === 'web') {
      return (
        pictures.map((image, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <View style={styles.thumbnailWrapper} key={`${image.url}-${index}`}>
            <Thumbnail image={image} click={handleOnImageClick} />
          </View>
        ))
      );
    }
    return (
      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {
          pictures.map((image, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <View style={[styles.thumbnailWrapper, { width: image.width, flexDirection: 'row' }]} key={`${image.url}-${index}`}>
              <Thumbnail image={image} click={handleOnImageClick} />
            </View>
          ))
        }
      </ScrollView>
    );
  }, [pictures]);

  return (
    <View style={[styles.container, pictures.length === 0 ? styles.messageContainer : {}]}>
      {pictures.length > 0 ? renderList() : (<Text style={[styles.message]}>{t('gallery.empty')}</Text>)}
      <Modal
        animationType="slide"
        transparent
        visible={!!focusedPhoto}
        onRequestClose={handleUnfocusPhoto}
      >
        <View style={{ flex: 1, backgroundColor: '#000000', position: 'relative' }}>
          <View style={[styles.header]}>
            <Text style={[styles.title]}>{(focusedPhoto?.label) ? focusedPhoto.label[i18n.language] : ''}</Text>
          </View>
          <Pressable
            onPress={() => setFocusedPhoto(null)}
            style={styles.closeBtn}
          >
            <MaterialIcons
              name="close"
              size={32}
              color="#FFFFFF"
              style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
            />
          </Pressable>
          <ImageBackground source={{ uri: focusedPhoto?.url }} resizeMode="contain" style={{ flex: 1 }} />
        </View>
      </Modal>
    </View>
  );
}

Gallery.propTypes = {
  pictures: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.shape({
        en: PropTypes.string,
        fr: PropTypes.string,
      }),
      url: PropTypes.string,
    }),
  ),
};

Gallery.defaultProps = {
  pictures: [],
};

export default Gallery;
