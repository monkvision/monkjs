import { useCallback, useEffect, useMemo, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';

import { utils } from '@monkvision/react-native';

import useUploadImage from '../useUploadPicture';

const { width, height } = Dimensions.get('window');
const initialPictureData = { isLoading: false, isUploaded: true, id: '', uri: '' };

export default ({ getSightPreview, setPictures, inspectionId }) => {
  const [accessGranted, setAccess] = useState(false);

  const handleUploadPicture = useUploadImage({ inspectionId, setPictures });

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
    if (!accessGranted) {
      handleRequestMediaLibraryAccess();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Picture,
        aspect,
        quality: 1,
        allowsMultipleSelection: true,
        base64: true,
      });

      if (!result.cancelled) {
        // if the sight has already a picture
        // we remove the old existing picture and replace it by the new one
        // else we add a new sight
        if (getSightPreview(id)) {
          setPictures((prev) => [
            ...prev.filter((picture) => picture.id !== id),
            { ...initialPictureData, id, uri: result.uri },
          ]);
          handleUploadPicture(result.uri, id);
        } else {
          setPictures((prev) => [...prev, { ...initialPictureData, id, uri: result.uri }]);
          handleUploadPicture(result.uri, id);
        }
      }
    }
  }, [accessGranted, aspect, getSightPreview,
    handleRequestMediaLibraryAccess, handleUploadPicture, setPictures]);

  return {
    accessGranted,
    handleOpenMediaLibrary,
    handleRequestMediaLibraryAccess,
    inputRef: { current: null },
    handlePickImage: () => null,
  };
};
