import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { IconButton, DataTable, Button, withTheme, List } from 'react-native-paper';
import { noop, startCase, snakeCase } from 'lodash';

import { utils } from '@monkvision/react-native';
import Drawer from '../Drawer';
import ImageViewer from '../ImageViewer';

import useOrientation from '../../hooks/useOrientation';
import useToggle from '../../hooks/useToggle';

import damageMetadataList from './metadataList';

import DamagePicturesPreview from './DamagePicturesPreview';
import CameraSimpleViewModal from './CameraSimpleViewModal/index';
import DamageRow from './DamageRow';
import DamagePicker from './DamagePicker';

const { spacing } = utils.styles;
const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 16,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  alignLeft: { justifyContent: 'flex-end' },
  buttonLabel: { color: '#FFFFFF' },
  validationButton: {
    margin: spacing(1),
    flex: 1,
    width: 120 },
  clearButton: { alignSelf: 'flex-end' },
  formWarningText: {
    marginTop: spacing(2),
    textAlign: 'center',
    color: 'gray',
  },
});

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
  const [isSelectDialogOpen, openSelectDialog, closeSelectDialog] = useToggle();
  const [isPreviewDialogOpen, openPreviewDialog, closePreviewDialog] = useToggle();

  const [damagePictures, setDamagePictures] = damagePicturesState;
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

  // check if the form is filled with data and not yet submitted (dirty)
  const isDirty = useMemo(() => Object.values(currentDamage).some(Boolean),
    [currentDamage]);

  // camera view
  if (isCameraViewOpen) {
    return (
      <CameraSimpleViewModal
        theme={theme}
        setDamagePictures={setDamagePictures}
        closeCameraView={closeCameraView}
        openPreviewDialog={handleOpenPreviewDialog}
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
      <Drawer
        isOpen={isOpen}
        handleClose={() => !isDirty && onClose()}
        onClose={handleClearDamagePictures}
      >
        <ScrollView style={{ height: Drawer.CONTENT_HEIGHT }}>
          <Drawer.Title
            title={`Add photos for ${wrapTitles}`}
            subtitle={wrapSubtitles}
            titleStyle={styles.cardTitle}
            left={(props) => <List.Icon {...props} icon="shape-square-plus" />}
          />
          <DamagePicturesPreview
            damagePictures={damagePictures}
            handleOpenPreviewDialog={handleOpenPreviewDialog}
          />
          <Drawer.Content>
            <Button
              accessibilityLabel="Reset form data"
              mode="outlined"
              icon="eraser-variant"
              color={colors.primary}
              style={styles.clearButton}
              onPress={() => { onReset(); handleClearDamagePictures(); }}
            >
              Reset
            </Button>
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
            {isDirty ? (
              <Text style={styles.formWarningText}>
                In order to close the form please hit submit or clear your data.
              </Text>
            ) : null}
          </Drawer.Content>
          <Drawer.Actions style={styles.cardActions}>
            <Button
              accessibilityLabel="Add damage"
              labelStyle={styles.buttonLabel}
              onPress={onSubmit}
              mode="contained"
              style={styles.validationButton}
              icon="shape-square-plus"
              disabled={!isDamageValid}
            >
              Add damage
            </Button>
            <Button
              accessibilityLabel="Add pictures"
              onPress={openCameraView}
              mode="outlined"
              color={colors.primary}
              style={[styles.validationButton, { borderColor: colors.primary }]}
              icon="camera-plus"
            >
              Add pictures
            </Button>
          </Drawer.Actions>
        </ScrollView>
      </Drawer>

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
