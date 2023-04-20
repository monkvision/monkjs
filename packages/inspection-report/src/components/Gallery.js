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

const pictureList = [
  {
    url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    label: 'hood',
  },
  {
    url: '',
    label: 'door_front_right',
  },
  {
    url: '',
    label: 'fender_back_left',
  },
  {
    url: '',
    label: 'wheel_back_left',
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
          <View style={styles.thumbnailWrapper} key={`${image.url}-${index}`}>
            <Thumbnail image={image} click={handleOnImageClick} />
          </View>
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
