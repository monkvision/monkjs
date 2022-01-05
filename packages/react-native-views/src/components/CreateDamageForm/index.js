import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { flushSync } from 'react-dom';
// import { View } from 'react-native';
import { IconButton, withTheme, Provider as PaperProvider } from 'react-native-paper';
import { noop, snakeCase } from 'lodash';

import ImageViewer from '../ImageViewer';
import useOrientation from '../../hooks/useOrientation';
import useToggle from '../../hooks/useToggle';

import damageMetadataList from './metadataList';

import DamagesForm from './DamageForm';
import CameraSimpleViewModal from './CameraSimpleViewModal/index';
import DamagePicker from './DamagePicker';
import useDamagesForm from './useDamagesForm';

function CreateDamageForm({
  theme,
  isOpen,
  onClose,
  currentDamage,
  onChangeCurrentDamage,
  damagePicturesState,
  isDamageValid,
  onSubmit,
  isLoading,
  onCameraOpen,
  onCameraClose,
  onReset,
}) {
  const { colors } = theme;
  const [isCameraViewOpen, openCameraView, closeCameraView] = useToggle();
  const [damagePictures, setDamagePictures] = damagePicturesState;

  const {
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
  } = useDamagesForm({ onChangeCurrentDamage, setDamagePictures });

  const damagePicturesViewer = useMemo(() => ({
    isOpen: isPreviewDialogOpen,
    images: damagePictures?.map((i) => ({ url: i.uri })),
    index: previewImage.index,
    handleDismiss: closePreviewDialog,
    deleteButton:
  <IconButton color={colors.error} onPress={handleRemovePicture} icon={isLoading ? undefined : 'trash-can'} />,
  }), [closePreviewDialog, colors.error, damagePictures,
    handleRemovePicture, isLoading, isPreviewDialogOpen, previewImage.index]);

  const [orientation,, orientationIsNotSupported] = useOrientation();

  // trigger the camera open/close events
  useEffect(() => {
    if (isCameraViewOpen) { onCameraOpen(); } else { onCameraClose(); }
  }, [isCameraViewOpen, onCameraClose, onCameraOpen]);

  // camera view
  if (isCameraViewOpen) {
    return (
      <PaperProvider theme={theme}>
        <CameraSimpleViewModal
          theme={theme}
          setDamagePictures={setDamagePictures}
          closeCameraView={closeCameraView}
          openPreviewDialog={(val) => {
            // close the camera synchronously and then call handleOpenPreviewDialog
            flushSync(() => closeCameraView());
            handleOpenPreviewDialog(val);
          }}
          damagePictures={damagePictures}
          {...damagePicturesViewer}
        />
      </PaperProvider>
    );
  }
  // The drawer doesn't support orientation change (based on animated)
  // in this case we force the drawer to be closed on landscape orientation
  if (orientation !== 1 && !orientationIsNotSupported) { return null; }
  return (
    <PaperProvider theme={theme}>
      <>
        <DamagesForm
          isOpen={isOpen}
          onClose={onClose}
          currentDamage={currentDamage}
          isDamageValid={isDamageValid}
          onSubmit={onSubmit}
          onReset={onReset}
          handleClearDamagePictures={handleClearDamagePictures}
          damagePictures={damagePictures}
          handleOpenPreviewDialog={handleOpenPreviewDialog}
          handleOpenSelectDialog={handleOpenSelectDialog}
          openCameraView={openCameraView}
        />

        {/* damage picker */}
        <DamagePicker
          visible={Boolean(isSelectDialogOpen && selectField)}
          selectedValue={snakeCase(currentDamage[selectField]) || ''}
          onValueChange={(value) => handleUpdateDamageMetaData({ [selectField]: value })}
          data={damageMetadataList[selectField] || []}
          onClose={handleDismissSelectDialog}
        />
        <ImageViewer {...damagePicturesViewer} />
      </>
    </PaperProvider>
  );
}
CreateDamageForm.propTypes = {
  currentDamage: PropTypes.shape({
    damage_type: PropTypes.string,
    part_type: PropTypes.string,
    severity: PropTypes.string,
  }),
  damagePicturesState: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.any), PropTypes.func]),
  isDamageValid: PropTypes.bool,
  isLoading: PropTypes.bool,
  isOpen: PropTypes.bool,
  onCameraClose: PropTypes.func,
  onCameraOpen: PropTypes.func,
  onChangeCurrentDamage: PropTypes.func,
  onClose: PropTypes.func,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func,

};

CreateDamageForm.defaultProps = {
  currentDamage: {
    part_type: null,
    damage_type: null,
    severity: null,
  },
  onClose: noop,
  onChangeCurrentDamage: noop,
  isOpen: false,
  damagePicturesState: [[], noop],
  isDamageValid: false,
  onSubmit: noop,
  isLoading: false,
  onCameraClose: noop,
  onCameraOpen: noop,
  onReset: noop,
};
export default withTheme(CreateDamageForm);
