import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { addOneImageToInspection, config } from '@monkvision/corejs';
import { Platform } from 'react-native';

export default ({ inspectionId, setPictures }) => {
  const dispatch = useDispatch();

  const handleUploadPicture = useCallback(async (picture, id) => {
    if (!inspectionId) { return; }

    // const uri = Platform.OS === 'ios' ? picture.replace('file://', '/private') : picture;

    setPictures((prev) => prev.map((image) => {
      if (image.id === id) { return { ...image, isLoading: true }; }
      return image;
    }));

    const filename = `${id}-${inspectionId}.jpg`;
    const multiPartKeys = { image: 'image', json: 'json', filename, type: 'image/jpg' };

    const headers = { ...config.axiosConfig, 'Content-Type': 'multipart/form-data' };
    const baseParams = { inspectionId, headers };

    const acquisition = { strategy: 'upload_multipart_form_keys', file_key: multiPartKeys.image };
    const json = JSON.stringify({ acquisition, tasks: ['damage_detection'] });

    const data = new FormData();
    data.append(multiPartKeys.json, json);

    if (Platform.OS === 'web') {
      const response = await fetch(picture);
      const blob = await response.blob();
      const file = await new File([blob], multiPartKeys.filename, { type: multiPartKeys.type });
      data.append(multiPartKeys.image, file);
    } else {
      data.append('image', {
        uri: picture,
        name: multiPartKeys.filename,
        type: multiPartKeys.type,
      });
    }

    dispatch(addOneImageToInspection({ ...baseParams, data })).unwrap()
      .then(() => {
        setPictures((prev) => prev.map((image) => {
          if (image.id === id) { return { ...image, isUploaded: true, isLoading: false }; }
          return image;
        }));
      })
      .catch(() => {
        setPictures((prev) => prev.map((image) => {
          if (image.id === id) { return { ...image, isFailed: true, isLoading: false }; }
          return image;
        }));
      });
  }, [dispatch, inspectionId, setPictures]);

  return handleUploadPicture;
};
