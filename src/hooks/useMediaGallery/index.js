import { useCallback, useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

function getDate() {
  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  return `${date}-${time}`;
}

const useMediaGallery = () => {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [pictures, preparePictures] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const getPermissions = useCallback(() => {
    if (!status) {
      requestPermission();
    } else if (!status.granted) {
      requestPermission();
    }
  }, [requestPermission, status]);

  const saveToDevice = useCallback(async () => {
    try {
      const picturesSights = Object.values(pictures);

      if (Platform.OS === 'web') {
        picturesSights.forEach((picture) => {
          const { source, sight } = picture;
          const { width, height } = source;
          const id = new Date().valueOf();
          const name = `${sight.id}-${id}-${width}x${height}`;

          const encodedUri = encodeURI(picture.source.base64);
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', name);
          document.body.appendChild(link);
          link.click();
        });
      } else {
        if (isLoading || isSaved || !picturesSights.length) {
          return;
        }
        setIsLoading(true);

        const renamePromises = [];
        const assetsPromises = [];

        picturesSights.forEach((pictureSight, index) => {
          const { source, sight } = pictureSight;
          const { uri, width, height } = source;
          const pathFolder = uri.slice(0, uri.lastIndexOf('/'));
          const extension = uri.slice(uri.lastIndexOf('.'), uri.length);
          const id = new Date().valueOf();
          const savePath = `${pathFolder}/${index}-${sight.id}-${id}-${width}x${height}${extension}`;

          renamePromises.push(FileSystem.moveAsync({ from: uri, to: savePath }));
          assetsPromises.push(MediaLibrary.createAssetAsync(savePath));
        });

        await Promise.all(renamePromises);
        const assets = await Promise.all(assetsPromises);
        const initialAsset = assets.pop();

        const albumName = `Vehicle-${getDate()}`;
        const newAlbum = await MediaLibrary.createAlbumAsync(albumName, initialAsset);

        if (newAlbum) {
          await MediaLibrary.addAssetsToAlbumAsync(assets, newAlbum.id, false);
          setIsSaved(true);
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  }, [isLoading, isSaved, pictures]);

  useEffect(getPermissions, [status, getPermissions]);

  return {
    saveToDevice,
    preparePictures,
    isLoading,
    isSaved,
  };
};

export default useMediaGallery;
