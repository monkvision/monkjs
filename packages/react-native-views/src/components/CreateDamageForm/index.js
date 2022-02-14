import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { IconButton, withTheme, Provider as PaperProvider } from 'react-native-paper';
import noop from 'lodash.noop';

import ImageViewer from '../ImageViewer';

import damageMetadataList from './metadataList';

import DamagesForm from './DamageForm';
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
  onReset,
}) {
  const { colors } = theme;
  const [damagePictures, setDamagePictures] = damagePicturesState;

  const {
    isPreviewDialogOpen,
    selectField,
    setSelectField,
    handleOpenPreviewDialog,
    handleUpdateDamageMetaData,
    handleRemovePicture,
    handleClearDamagePictures,
    previewImage,
    closePreviewDialog,
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

  return (
    <PaperProvider theme={theme}>
      <DamagesForm
        overlay={() => <ImageViewer {...damagePicturesViewer} />}
        isOpen={isOpen}
        onClose={onClose}
        currentDamage={currentDamage}
        isDamageValid={isDamageValid}
        onSubmit={onSubmit}
        onReset={onReset}
        handleClearDamagePictures={handleClearDamagePictures}
        damagePictures={damagePictures}
        handleOpenPreviewDialog={handleOpenPreviewDialog}
        setSelectField={setSelectField}
        data={damageMetadataList[selectField] || []}
        onChange={(value) => handleUpdateDamageMetaData({ [selectField]: value })}
        selectedValue={currentDamage[selectField]}
        isLoading={isLoading}
      />
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
