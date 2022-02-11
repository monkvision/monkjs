import { useCallback, useEffect, useMemo, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions, Platform } from 'react-native';

import { utils } from '@monkvision/toolkit';

import useUpload from 'hooks/useUpload';

const { width, height } = Dimensions.get('window');
export const initialPictureData = { isLoading: false, isFailed: false, isUploaded: false, id: '', label: '', uri: null };

export default ({ pictures, setPictures, inspectionId }) => {
  const [accessGranted, setAccess] = useState(false);

  const onLoading = useCallback((id) => setPictures(
    (prev) => prev.map((image) => (image.id === id ? { ...image, isLoading: true } : image)),
  ), [setPictures]);

  const onSuccess = useCallback((id) => setPictures((prev) => prev.map((image) => (image.id === id
    ? { ...image, isUploaded: true, isLoading: false, isFailed: false } : image))), [setPictures]);

  const onError = useCallback((id) => setPictures((prev) => prev.map((image) => (image.id === id ? {
    ...image, isUploaded: false, isFailed: true, isLoading: false } : image))),
  [setPictures]);

  const handleUploadPicture = useUpload({
    inspectionId,
    onSuccess,
    onLoading,
    onError,
  });

  // request media library permission
  const handleRequestMediaLibraryAccess = useCallback(async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setAccess(granted);
  }, []);

  useEffect(() => {
    handleRequestMediaLibraryAccess();
  }, [handleRequestMediaLibraryAccess]);

  const aspect = useMemo(() => {
    const ratio = utils.makeRatio(Math.max(width, height), Math.min(width, height));
    return [parseInt(ratio[0], 10), parseInt(ratio[2], 10)];
  }, []);

  // request open media library
  const handleOpenMediaLibrary = useCallback(async (id) => {
    if (!accessGranted && Platform.OS !== 'web') {
      handleRequestMediaLibraryAccess();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Picture,
        aspect,
        quality: 1,
        base64: Platform.OS === 'web',
      });

      if (!result.cancelled) {
        // if the sight has already a picture
        // then we remove the old existing picture and replace it by the new one
        // else we add a new sight
        if (pictures.some((picture) => picture.id === id)) {
          setPictures((prev) => prev.map((image) => {
            if (image.id === id) { return { ...image, uri: result.uri }; }
            return image;
          }));
          handleUploadPicture(result.uri, id);
        } else {
          setPictures((prev) => prev.map((image) => {
            if (image.id === id) { return { ...image, id, uri: result.uri }; }
            return image;
          }));
          handleUploadPicture(result.uri, id);
        }
      }
    }
  }, [accessGranted, aspect, pictures,
    handleRequestMediaLibraryAccess, handleUploadPicture, setPictures]);

  return {
    accessGranted,
    handleOpenMediaLibrary,
    handleRequestMediaLibraryAccess,
    handleUploadPicture,
    handlePickImage: () => null,
  };
};
