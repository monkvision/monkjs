import { useCallback, useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

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

  const getPermissions = useCallback(() => {
    if (!status) {
      console.log('No media permission status, requesting..');
      requestPermission();
    } else if (!status.granted) {
      requestPermission().then((newPermission) => {
        if (newPermission.granted) { console.info('Media permission granted !'); } else { console.warn('Unable to get media permissions !'); }
      });
    } else { console.info('Media permission already granted !'); }
  }, [requestPermission, status]);

  const saveToDevice = useCallback(async () => {
    try {
      const picturesSights = Object.values(pictures);

      if (!picturesSights.length) { return; }
      setIsLoading(true);

      const renamePromises = [];
      const assetsPromises = [];

      picturesSights.forEach((pictureSight, index) => {
        const { source, sight } = pictureSight;
        const { uri, width, height } = source;
        const pathFolder = uri.slice(0, uri.lastIndexOf('/'));
        const extention = uri.slice(uri.lastIndexOf('.'), uri.length);
        const id = new Date().valueOf();
        const savePath = `${pathFolder}/${index}-${sight.id}-${id}-${width}x${height}${extention}`;

        renamePromises.push(FileSystem.moveAsync({ from: uri, to: savePath }));
        assetsPromises.push(MediaLibrary.createAssetAsync(savePath));
      });

      const renamedPictures = await Promise.all(renamePromises);
      console.log('renamedPictures', renamedPictures);
      const assets = await Promise.all(renamedPictures);
      console.log('assets', assets);
      const initialAsset = assets.pop();

      const albumName = `Vehicle-${getDate()}`;
      const newAlbum = await MediaLibrary.createAlbumAsync(albumName, initialAsset);

      if (newAlbum) {
        await MediaLibrary.addAssetsToAlbumAsync(assets, newAlbum.id, false);
      } else { console.error('Unable to get or create album'); }
      setIsLoading(false);
    } catch (error) {
      console.error('savePictures error', error);
      setIsLoading(false);
    }
  }, [pictures]);

  useEffect(getPermissions, [status, getPermissions]);

  return {
    saveToDevice,
    preparePictures,
    isLoading,
  };
};

export default useMediaGallery;
