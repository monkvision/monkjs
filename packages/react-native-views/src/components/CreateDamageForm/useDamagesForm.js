import { useState, useCallback } from 'react';

import { useToggle } from '@monkvision/toolkit';

export default function useDamagesForm({ onChangeCurrentDamage, setDamagePictures }) {
  const [isPreviewDialogOpen, openPreviewDialog, closePreviewDialog] = useToggle();

  const [previewImage, setPreviewImage] = useState({});
  const [selectField, setSelectField] = useState(null);

  const handleOpenPreviewDialog = useCallback((image) => {
    setPreviewImage(image);
    openPreviewDialog();
  }, [openPreviewDialog]);

  const handleUpdateDamageMetaData = useCallback((metaData) => {
    onChangeCurrentDamage(metaData);
  }, [onChangeCurrentDamage]);

  const handleRemovePicture = useCallback(() => {
    // Remove taken picture
    setDamagePictures((prev) => prev.filter((_, i) => i !== previewImage.index));
    closePreviewDialog();
    setPreviewImage({});
  }, [setDamagePictures, closePreviewDialog, previewImage.index]);

  const handleClearDamagePictures = useCallback(() => setDamagePictures([]), [setDamagePictures]);

  return {
    isPreviewDialogOpen,
    setSelectField,
    selectField,
    handleOpenPreviewDialog,
    handleUpdateDamageMetaData,
    handleRemovePicture,
    handleClearDamagePictures,
    previewImage,
    closePreviewDialog,
  };
}
