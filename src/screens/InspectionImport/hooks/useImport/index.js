import { useCallback, useRef } from 'react';

import useUploadImage from '../useUploadPicture';

const initialPictureData = { isLoading: false, isUploaded: true, id: '', uri: '' };

export default ({ getSightPreview, setPictures, inspectionId }) => {
  const inputRef = useRef(null);
  const handleOpenMediaLibrary = () => inputRef.current.click();

  const handleUploadPicture = useUploadImage({ inspectionId, setPictures });

  const handlePickImage = useCallback((id, uri) => {
    // if the sight has already an picture
    if (getSightPreview(id)) {
      // we remove the old esisting one and replace it by the new one
      setPictures((prev) => [
        ...prev.filter((picture) => picture.id !== id),
        { ...initialPictureData, id, uri },
      ]);
      handleUploadPicture(uri, id);
    } else {
      setPictures((prev) => [...prev, { ...initialPictureData, id, uri }]);
      handleUploadPicture(uri, id);
    }
  }, [getSightPreview, handleUploadPicture, setPictures]);

  return { inputRef,
    handleOpenMediaLibrary,
    handlePickImage,
    handleRequestMediaLibraryAccess: () => null,
    accessGranted: true };
};
