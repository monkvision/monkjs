import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import Thumbnail from './Thumbnail';
import { useDesktopMode } from './../../hooks';

const styles = StyleSheet.create({
  container: {
    alignContent: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 15,
    overflowY: 'auto',
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
  },
  partsImageWrapper: {
    borderColor: '#a29e9e',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    margin: 5,
    paddingTop: 10,
  }
});

function Gallery({ pictures }) {
  const { i18n, t } = useTranslation();
  const isDesktopMode = useDesktopMode();
  const [focusedPhoto, setFocusedPhoto] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const { width, height } = useWindowDimensions();
  const [gestureState, setGestureState] = useState({});
  const [transformX, setTransformX] = useState('center');
  const [transformY, setTransformY] = useState('center');
  const scale = useRef(new Animated.Value(1)).current;
  const transformOffsetFromCenter = 100;

  const handleOnImageClick = useCallback((focusedImage) => {
    if (focusedImage.url) {
      setFocusedPhoto(focusedImage);
    }
  }, [focusedPhoto]);

  const handleUnfocusPhoto = useCallback(() => {
    scale.setValue(1);
    setTransformX('center');
    setTransformY('center');
    setFocusedPhoto(null);
  }, [scale]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: () => true,
      onPanResponderRelease: (event, gs) => setGestureState({ dx: gs.x0, dy: gs.y0 }),
    }),
  ).current;

  useEffect(() => {
    Animated.timing(scale, {
      duration: 200,
      easing: Easing.ease,
      toValue: isZoomed ? 2 : 1,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [isZoomed]);

  useEffect(() => {
    if (gestureState.dx && gestureState.dy) {
      setIsZoomed(!isZoomed);
      let dx = 'center';
      let dy = 'center';
      if (gestureState.dx > (width / 2) - transformOffsetFromCenter) {
        dx = 'left';
      } else if (gestureState.dx > (width / 2) + transformOffsetFromCenter) {
        dx = 'right';
      }

      if (gestureState.dy > (height / 2) - transformOffsetFromCenter) {
        dy = 'top';
      } else if (gestureState.dy > (height / 2) + transformOffsetFromCenter) {
        dy = 'bottom';
      }
      setTransformX(dx);
      setTransformY(dy);
    }
  }, [gestureState]);

  return (
    <View style={[
      styles.container,
      pictures.length === 0 ? styles.messageContainer : {}
    ]}>
      {pictures.length > 0 ? pictures.map((image, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <View key={`${image.url}-${index}`} style={isDesktopMode && styles.partsImageWrapper}>
          <View style={styles.thumbnailWrapper}>
            <Thumbnail image={image} click={handleOnImageClick} />
          </View>
          {
            isDesktopMode && image?.rendered_outputs && image?.rendered_outputs.length > 0 &&
            image.rendered_outputs.map((innerImage, innerIndex) => (
              <View style={styles.thumbnailWrapper} key={`${innerImage.url}-${innerIndex}`}>
                <Thumbnail image={innerImage} click={handleOnImageClick} />
              </View>
            ))
          }
        </View>
      )) : (<Text style={[styles.message]}>{t('gallery.empty')}</Text>)}
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
            onPress={handleUnfocusPhoto}
            style={styles.closeBtn}
          >
            <MaterialIcons
              name="close"
              size={32}
              color="#FFFFFF"
              style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
            />
          </Pressable>
          <Animated.Image
            source={{ uri: focusedPhoto?.url }}
            style={{
              flex: 1,
              cursor: isZoomed ? 'zoom-out' : 'zoom-in',
              transformOrigin: `${transformX} ${transformY}`,
              transform: [
                { scale },
              ],
            }}
            resizeMode='cover'
            {...panResponder.panHandlers}
          />
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
