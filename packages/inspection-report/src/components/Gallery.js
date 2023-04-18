import React, { useCallback, useState } from 'react';
import { Modal, StyleSheet, View, Image, Pressable, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Thumbnail from './common/Thumbnail';

const styles = StyleSheet.create({
  container: {
    alignContent: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    paddingVertical: 15,
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

const pictureList = [
  {
    url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    label: {
      fr: 'Hood',
      en: 'Hood',
    },
  },
  {
    url: '',
    label: {
      fr: 'Burger',
      en: 'Burger',
    },
  },
  {
    url: '',
    label: {
      fr: 'Front Full Left',
      en: 'Front Full Left',
    },
  },
  {
    url: '',
    label: {
      fr: 'Coffee',
      en: 'Coffee',
    },
  },
  {
    url: '',
    label: {
      fr: 'Front Lateral Left',
      en: 'Front Lateral Left',
    },
  },
  {
    url: '',
    label: {
      fr: 'Rocker Panel Left',
      en: 'Rocker Panel Left',
    },
  },
  {
    url: '',
    label: {
      fr: 'Basketball',
      en: 'Basketball',
    },
  },
  {
    url: '',
    label: {
      fr: 'Fern',
      en: 'Fern',
    },
  },
  {
    url: '',
    label: {
      fr: 'Mushrooms',
      en: 'Mushrooms',
    },
  },
  {
    url: '',
    label: {
      fr: 'Tomato basil',
      en: 'Tomato basil',
    },
  },
  {
    url: '',
    label: {
      fr: 'Sea star',
      en: 'Sea star',
    },
  },
  {
    url: '',
    label: {
      fr: 'Bike',
      en: 'Bike',
    },
  },
];

export default function Gallery() {
  const [photo, setPhoto] = useState('');
  const [visibleImageInFullScreen, setVisibleImageInFullScreen] = useState(false);

  const handleOnImageClick = useCallback((selectedImage) => {
    if (selectedImage.url) {
      setPhoto(selectedImage);
      setVisibleImageInFullScreen(true);
    }
  }, [photo, visibleImageInFullScreen]);

  return (
    <View style={styles.container}>
      {
        pictureList.map((image, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Thumbnail key={`${image.url}-${index}`} image={image} click={handleOnImageClick} />
        ))
      }

      <Modal
        animationType="slide"
        transparent
        visible={visibleImageInFullScreen}
        onRequestClose={() => {
          setPhoto('');
          setVisibleImageInFullScreen(!visibleImageInFullScreen);
        }}
      >
        <view style={{ flex: 1 }}>
          <View style={styles.closeButtonWrapper}>
            <Text style={styles.header}>{photo?.label?.en}</Text>
            <Pressable
              onPress={() => {
                setPhoto('');
                setVisibleImageInFullScreen(!visibleImageInFullScreen);
              }}
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
              uri: photo.url,
            }}
          />
        </view>
      </Modal>
    </View>
  );
}
