import { useState, useCallback } from 'react';
import useToggle from '../../hooks/useToggle';

export default function useDamagesForm({ onChangeCurrentDamage, setDamagePictures }) {
  const [isSelectDialogOpen, openSelectDialog, closeSelectDialog] = useToggle();
  const [isPreviewDialogOpen, openPreviewDialog, closePreviewDialog] = useToggle();

  const [previewImage, setPreviewImage] = useState({});
  const [selectField, setSelectField] = useState(null);

  const handleOpenPreviewDialog = useCallback((image) => {
    setPreviewImage(image);
    openPreviewDialog();
  }, [openPreviewDialog]);

  const handleOpenSelectDialog = useCallback((field) => {
    setSelectField(field);
    openSelectDialog();
  }, [openSelectDialog]);

  const handleDismissSelectDialog = useCallback(() => {
    setSelectField(null);
    closeSelectDialog();
  }, [closeSelectDialog]);

  const handleUpdateDamageMetaData = useCallback((metaData) => {
    onChangeCurrentDamage(metaData);
    handleDismissSelectDialog();
  }, [handleDismissSelectDialog, onChangeCurrentDamage]);

  const handleRemovePicture = useCallback(() => {
    // Remove taken picture
    setDamagePictures((prev) => prev.filter((_, i) => i !== previewImage.index));
    closePreviewDialog();
    setPreviewImage({});
  }, [setDamagePictures, closePreviewDialog, previewImage.index]);

  const handleClearDamagePictures = useCallback(() => setDamagePictures([]), [setDamagePictures]);

  return {
    isSelectDialogOpen,
    isPreviewDialogOpen,
    selectField,
    handleOpenPreviewDialog,
    handleOpenSelectDialog,
    handleUpdateDamageMetaData,
    handleRemovePicture,
    handleClearDamagePictures,
    previewImage,
    closePreviewDialog,
    handleDismissSelectDialog,
  };
}
