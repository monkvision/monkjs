import { useCallback } from 'react';

import useUpload from '../useUpload';

export const initialPictureData = { isLoading: false, isFailed: false, isUploaded: false, id: '', label: '', uri: null };

export default ({ pictures, setPictures, inspectionId }) => {
  const handleUploadPicture = useUpload({ inspectionId, setPictures });

  const handlePickImage = useCallback((uri, id) => {
    // if the sight has already an picture
    if (pictures.some((picture) => picture.id === id)) {
      // we remove the old esisting one and replace it by the new one
      setPictures((prev) => prev.map((image) => {
        if (image.id === id) { return { ...image, uri }; }
        return image;
      }));
      handleUploadPicture(uri, id);
    } else {
      setPictures((prev) => prev.map((image) => {
        if (image.id === id) { return { ...image, id, uri }; }
        return image;
      }));
      handleUploadPicture(uri, id);
    }
  }, [pictures, handleUploadPicture, setPictures]);

  return {
    handlePickImage,
    handleUploadPicture,
    handleOpenMediaLibrary: () => null,
    handleRequestMediaLibraryAccess: () => null,
    accessGranted: true,
  };
};
