import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { IconButton, DataTable, Button, withTheme, List } from 'react-native-paper';
import { noop, startCase } from 'lodash';

import Drawer from '../Drawer';
import ImageViewer from '../ImageViewer';

import useOrientation from '../../hooks/useOrientation';
import useToggle from '../../hooks/useToggle';

import damageMetadataList from './metadataList';
import styles from './styles';

import DamagePicturesViewer from './DamagePicturesPreview';
import CameraSimpleViewModal from './CameraSimpleViewModal/index';
import DamageRow from './DamageRow';
import DamagePicker from './DamagePicker';

function CreateDamageForm({
  theme,
  isOpen,
  handleClose,
  currentDamage,
  updateCurrentDamage,
  damagePicturesState,
  isDamageValid,
  handleCreateDamageRequest,
  isLoading,
  onCameraOpen,
  onCameraClose,
}) {
  const { colors } = theme;
  const [isCameraViewOpen, openCameraView, closeCameraView] = useToggle();
  const [isSelectDialogOpen, openSelectDialog, closeSelectDialog] = useToggle();
  const [isPreviewDialogOpen, openPreviewDialog, closePreviewDialog] = useToggle();

  const [damagePictures, setDamagePictures] = damagePicturesState;
  const [previewImage, setPreviewImage] = useState(false);
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
    updateCurrentDamage(metaData);
    handleDismissSelectDialog();
  }, [handleDismissSelectDialog, updateCurrentDamage]);

  const handleRemovePicture = useCallback(() => {
    // Remove taken picture
    setDamagePictures((old) => old.filter((_p, i) => i !== previewImage.index));
    closePreviewDialog();
    setPreviewImage({});
  }, [setDamagePictures, closePreviewDialog, previewImage.index]);

  const handleClearDamagePictures = useCallback(() => setDamagePictures([]), [setDamagePictures]);

  const wrapTitles = useMemo(() => {
    if (currentDamage.damage_type) { return startCase(currentDamage.damage_type); }
    return 'a damage';
  }, [currentDamage.damage_type]);

  const wrapSubtitles = useMemo(() => {
    if (currentDamage.part_type) { return `On the ${startCase(currentDamage.part_type)} part`; }
    return 'On a part';
  }, [currentDamage.part_type]);

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
      <CameraSimpleViewModal
        theme={theme}
        setDamagePictures={setDamagePictures}
        closeCameraView={closeCameraView}
        openPreviewDialog={openPreviewDialog}
        damagePictures={damagePictures}
        {...damagePicturesViewer}
      />
    );
  }

  // The drawer doesn't support orientation change (based on animated)
  // in this case we force the drawer to be closed on landscape orientation
  if (orientation !== 1 && !orientationIsNotSupported) { return null; }
  return (
    <>
      <Drawer isOpen={isOpen} handleClose={handleClose} onClose={handleClearDamagePictures}>
        <ScrollView style={{ height: Drawer.CONTENT_HEIGHT }}>
          <Drawer.Title
            title={`Add photos for ${wrapTitles}`}
            subtitle={wrapSubtitles}
            titleStyle={styles.cardTitle}
            left={(props) => <List.Icon {...props} icon="shape-square-plus" />}
            right={() => (
              <IconButton
                icon="camera-plus"
                size={30}
                style={styles.cameraIcon}
                color={colors.primary}
                onPress={openCameraView}
              />
            )}
          />
          <DamagePicturesViewer
            damagePictures={damagePictures}
            handleOpenPreviewDialog={handleOpenPreviewDialog}
          />
          <Drawer.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Add damage Metadata</DataTable.Title>
                <DataTable.Title style={styles.alignLeft}>Value</DataTable.Title>
              </DataTable.Header>
              <DamageRow
                title="Part type"
                value={currentDamage.part_type}
                key="metadata-partType"
                onPress={() => handleOpenSelectDialog('part_type')}
              />
              <DamageRow
                title="Damage type"
                value={currentDamage.damage_type}
                key="metadata-damageType"
                onPress={() => handleOpenSelectDialog('damage_type')}
              />
              <DamageRow
                title="Severity"
                value={currentDamage.severity}
                key="metadata-severity"
                onPress={() => handleOpenSelectDialog('severity')}
                disabled
              />
            </DataTable>
          </Drawer.Content>
          <Drawer.Actions style={styles.cardActions}>
            <Button
              labelStyle={styles.buttonLabel}
              onPress={handleCreateDamageRequest}
              mode="contained"
              style={styles.validationButton}
              icon="shape-square-plus"
              disabled={!isDamageValid}
            >
              Add damage
            </Button>
          </Drawer.Actions>
        </ScrollView>
      </Drawer>

      {/* damage picker */}
      <DamagePicker
        visible={Boolean(isSelectDialogOpen && selectField)}
        selectedValue={currentDamage[selectField] || ''}
        onValueChange={(value) => handleUpdateDamageMetaData({ [selectField]: value })}
        data={damageMetadataList[selectField]}
        onClose={handleDismissSelectDialog}
      />
      <ImageViewer {...damagePicturesViewer} />
    </>
  );
}
CreateDamageForm.propTypes = {
  currentDamage: PropTypes.shape({
    damage_type: PropTypes.string,
    part_type: PropTypes.string,
    severity: PropTypes.string,
  }),
  damagePicturesState: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.any), PropTypes.func]),
  handleClose: PropTypes.func,
  handleCreateDamageRequest: PropTypes.func,
  isDamageValid: PropTypes.bool,
  isLoading: PropTypes.bool,
  isOpen: PropTypes.bool,
  onCameraClose: PropTypes.func,
  onCameraOpen: PropTypes.func,
  updateCurrentDamage: PropTypes.func,

};

CreateDamageForm.defaultProps = {
  currentDamage: {
    part_type: null,
    damage_type: null,
    severity: null,
  },
  handleClose: noop,
  updateCurrentDamage: noop,
  isOpen: false,
  damagePicturesState: [[], noop],
  isDamageValid: false,
  handleCreateDamageRequest: noop,
  isLoading: false,
  onCameraClose: noop,
  onCameraOpen: noop,
};
export default withTheme(CreateDamageForm);
