import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { spacing } from 'config/theme';

import { useNavigation } from '@react-navigation/native';
import { utils } from '@monkvision/react-native';

import { Button, Text } from 'react-native-paper';
import { StyleSheet, Platform, SafeAreaView, View, Image, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  root: {
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flexGrow: 1, minHeight: 'calc(100vh - 64px)' },
    }),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    margin: spacing(2),
  },
  logo: {
    marginLeft: spacing(2),
  },
  button: {
    margin: spacing(1),
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});

const { width, height } = Dimensions.get('window');
export default () => {
  const navigation = useNavigation();

  const [image, setImage] = useState(null);
  const [accessGranted, setAccess] = useState(false);

  const handleRequestGalleryAccess = useCallback((async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setAccess(false);
      } else {
        setAccess(true);
      }
    }
  }), []);

  useEffect(() => {
    handleRequestGalleryAccess();
  }, [handleRequestGalleryAccess]);

  const aspect = useMemo(() => {
    const ratio = utils.makeRatio(Math.max(width, height), Math.min(width, height));
    return [ratio[0], ratio[2]];
  }, []);
  const handleOpenGallery = useCallback(async () => {
    if (Platform.OS !== 'web') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        aspect,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  }, [aspect]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Import inspection images',
        headerBackVisible: true,
      });
    }
  }, [navigation]);

  return (
    <View style={styles.root}>
      <StatusBar />
      <SafeAreaView style={styles.root}>
        {image?.map
          ? image.map((img) => <Image source={{ uri: img }} style={{ width: 200, height: 200 }} />)
          : <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        {accessGranted
          ? <Button onPress={handleOpenGallery}>Import images</Button>
          : (
            <View>
              <Text style={styles.text}>
                To choose images from your gallery, your will have to give
                Monk App the permission to access your files
              </Text>
              <Button onPress={handleRequestGalleryAccess}>Request access</Button>
            </View>
          )}

      </SafeAreaView>
    </View>
  );
};
