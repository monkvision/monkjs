import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { addOneImageToInspection, config } from '@monkvision/corejs';
import { Platform } from 'react-native';

export default ({ inspectionId, setPictures }) => {
  const dispatch = useDispatch();

  const handleUploadPicture = useCallback((picture, id) => {
    if (!inspectionId) { return; }

    const uri = Platform.OS === 'ios' ? picture.replace('file://', '/private') : picture;

    setPictures((prev) => prev.map((image) => {
      if (image.id === id) { return { ...image, isLoading: true }; }
      return image;
    }));

    const baseParams = {
      inspectionId,
      headers: { ...config.axiosConfig, 'Content-Type': 'multipart/form-data' },
    };

    const multiPartKeys = {
      image: 'image',
      json: 'json',
      filename: `${id}-${inspectionId}.png`,
      type: 'image/png',
    };
    const jsonData = JSON.stringify({
      acquisition: {
        strategy: 'upload_multipart_form_keys',
        file_key: multiPartKeys.image,
      },
      tasks: ['damage_detection'],
    });

    fetch(uri).then((res) => res.blob())
      .then((buf) => new File(
        [buf], multiPartKeys.filename,
        { type: multiPartKeys.type },
      ))
      .then((imageFile) => {
        const data = new FormData();
        data.append(multiPartKeys.json, jsonData);
        data.append(multiPartKeys.image, imageFile);

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
      });
  }, [dispatch, inspectionId, setPictures]);

  return handleUploadPicture;
};
