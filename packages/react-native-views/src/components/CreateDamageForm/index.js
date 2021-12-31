import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Image, FlatList, View, Text } from 'react-native';
import { IconButton, DataTable, Button, withTheme, List, TouchableRipple, Portal, Modal, Dialog, Divider } from 'react-native-paper';
import { noop, startCase, isEmpty } from 'lodash';

import { utils } from '@monkvision/react-native';

import useOrientation from '../../hooks/useOrientation';
import Drawer from '../Drawer';
import ImageViewer from '../ImageViewer';
import useToggle from '../../hooks/useToggle';

import CameraSimpleView from '../CaptureTour/CameraSimpleView';
import damageMetadataList from './metadataList';

const spacing = utils.styles.spacing;
const styles = StyleSheet.create({
  root: {
    paddingVertical: spacing(1),
  },
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
  },
  cardTitle: {
    fontSize: 16,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  images: {
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'row',
    flexShrink: 0,
    flexWrap: 'nowrap',
    marginBottom: spacing(2),
    marginHorizontal: spacing(1),
  },
  image: {
    flex: 1,
    width: 400,
    height: 300,
    marginHorizontal: spacing(1),
  },
  previewImage: {
    flex: 1,
    width: 400,
    height: 400,
    marginHorizontal: spacing(0),
  },
  scrollArea: {
    width: 400,
    backgroundColor: '#FFF',
    alignSelf: 'center',
  },
  flatList: {
    flex: 1,
    width: 360,
    maxHeight: 400,
    marginHorizontal: 0,
  },
  button: { width: '100%', marginVertical: 4 },
  alignLeft: {
    justifyContent: 'flex-end',
  },
  cell: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingTop: 5,
  },
  buttonLabel: { color: '#FFFFFF' },
  validationButton: { margin: spacing(2), flex: 1 },
  divider: { opacity: 0.3 },
  cameraIcon: { marginRight: spacing(4) },
});

function RowCell({ value, icon, title }) {
  return (
    <>
      <DataTable.Cell>{title}</DataTable.Cell>
      <DataTable.Cell style={styles.alignLeft}>
        <View style={styles.cell}>
          <Text>{startCase(value) || 'Not given'}</Text>
          <IconButton icon={icon} disabled />
        </View>
      </DataTable.Cell>
    </>
  );
}
RowCell.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string,
  value: PropTypes.string,
};
RowCell.defaultProps = {
  value: null,
  title: null,
};

function CreateDamageForm({
  theme,
  isOpen,
  handleClose,
  currentDamage,
  updateDamageMetaData,
  damagePicturesState,
  isDamageValid,
  handleCreateDamageRequest,
  isLoading,
  onCameraOpen,
  onCameraClose,
}) {
  const [isCameraViewOpen, openCameraView, closeCameraView] = useToggle();
  const [isSelectDialogOpen, openSelectDialog, closeSelectDialog] = useToggle();
  const [isPreviewDialogOpen, openPreviewDialog, closePreviewDialog] = useToggle();

  const [damagePictures, setDamagePictures] = damagePicturesState;
  const [previewImage, setPreviewImage] = useState(false);
  const [currentSelectItems, setCurrentSelectItems] = useState({ field: undefined, values: [] });

  const handleOpenPreviewDialog = useCallback((image) => {
    setPreviewImage(image);
    openPreviewDialog();
  }, [openPreviewDialog]);

  const handleOpenSelectDialog = useCallback((fieldValues) => {
    setCurrentSelectItems(fieldValues);
    openSelectDialog();
  }, [openSelectDialog]);

  const handleDismissSelectDialog = useCallback(() => {
    setCurrentSelectItems({ field: undefined, values: [] });
    closeSelectDialog();
  }, [closeSelectDialog]);

  const handleUpdateDamageMetaData = useCallback((val) => {
    updateDamageMetaData(val);
    handleDismissSelectDialog();
  }, [handleDismissSelectDialog, updateDamageMetaData]);

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

  const [orientation,, orientationIsNotSupported] = useOrientation();

  // trigger the camera open/close events
  useEffect(() => {
    if (isCameraViewOpen) { onCameraOpen(); } else { onCameraClose(); }
  }, [isCameraViewOpen, onCameraClose, onCameraOpen]);

  if (isEmpty(currentDamage)) { return null; }
  if (isCameraViewOpen) {
    return (
      <Portal>
        <Modal visible>
          <View style={{ backgroundColor: '#FFF', width: '100%', height: '100%' }}>
            <CameraSimpleView
              isLoading={false}
              onTakePicture={noop}
              onCloseCamera={(pictures) => { closeCameraView(); setDamagePictures(pictures); }}
              theme={theme}
              initialPicturesState={damagePictures}
            />
          </View>
        </Modal>
      </Portal>
    );
  }

  // the drawer doesn't support orientation change (based on animated)
  // in this case we force the drawer to be opened onlu in portrait orientation
  if (orientation !== 1 && !orientationIsNotSupported) { return null; }
  return (
    <>
      <Drawer isOpen={isOpen} handleClose={handleClose} onClose={handleClearDamagePictures}>
        <ScrollView style={{ height: Drawer.CONTENT_HEIGHT }}>
          <Drawer.Title
            title={`Add photos for ${wrapTitles}`}
            subtitle={wrapSubtitles}
            titleStyle={styles.cardTitle}
            onClick={() => {}}
            left={(props) => <List.Icon {...props} icon="shape-square-plus" />}
            right={() => (
              <IconButton
                icon="camera-plus"
                size={30}
                style={styles.cameraIcon}
                color={theme.colors.primary}
                onPress={openCameraView}
              />
            )}
          />
          <ScrollView contentContainerStyle={styles.images} horizontal>
            {!isEmpty(damagePictures) ? damagePictures?.map(({ uri }, index) => (
              <TouchableRipple
                key={String(index)}
                onPress={() => handleOpenPreviewDialog({ uri, index })}
              >
                <Image style={styles.image} source={{ uri }} />
              </TouchableRipple>
            )) : null}
          </ScrollView>
          <Drawer.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Add damage Metadata</DataTable.Title>
                <DataTable.Title style={styles.alignLeft}>Value</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row
                key="metadata-partType"
                onPress={() => handleOpenSelectDialog(damageMetadataList.partTypes)}
              >
                <RowCell title="Part type" value={currentDamage.part_type} icon="pencil" />
              </DataTable.Row>
              <DataTable.Row
                key="metadata-damageType"
                onPress={() => handleOpenSelectDialog(damageMetadataList.damageTypes)}
              >
                <RowCell title="Damage type" value={currentDamage.damage_type} icon="pencil" />
              </DataTable.Row>
              <DataTable.Row
                key="metadata-severity"
                onPress={() => handleOpenSelectDialog(damageMetadataList.severityTypes)}
                disabled
              >
                <RowCell title="Severity" value={currentDamage.severity} icon="pencil" />
              </DataTable.Row>
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
      <Portal>
        <Modal visible={isSelectDialogOpen}>
          <Dialog.ScrollArea style={styles.scrollArea}>
            <FlatList
              style={[styles.flatList]}
              data={currentSelectItems.values}
              keyExtractor={(_item, index) => String(index)}
              ListHeaderComponent={() => (
                <List.Subheader theme={theme}>
                  {startCase(currentSelectItems.field) }
                </List.Subheader>
              )}
              ItemSeparatorComponent={() => (<Divider style={styles.divider} />)}
              renderItem={({ item: value }) => (
                <List.Item
                  title={startCase(value)}
                  theme={theme}
                  titleEllipsizeMode="middle"
                  onPress={() => handleUpdateDamageMetaData({
                    field: currentSelectItems.field,
                    value,
                  })}
                />
              )}
            />
            <Dialog.Actions>
              <Button onPress={handleDismissSelectDialog} style={styles.button} mode="outlined">
                Cancel
              </Button>
            </Dialog.Actions>
          </Dialog.ScrollArea>

        </Modal>
      </Portal>
      <ImageViewer
        isOpen={isPreviewDialogOpen}
        images={damagePictures?.map((i) => ({ url: i.uri }))}
        index={previewImage.index}
        handleDismiss={closePreviewDialog}
        deleteButton={(
          <IconButton
            color={theme.colors.error}
            onPress={handleRemovePicture}
            icon={isLoading ? undefined : 'trash-can'}
          />
        )}
      />
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
  updateDamageMetaData: PropTypes.func,

};

CreateDamageForm.defaultProps = {
  currentDamage: {
    part_type: null,
    damage_type: null,
    severity: null,
  },
  handleClose: noop,
  updateCurrentDamage: noop,
  updateDamageMetaData: noop,
  isOpen: false,
  damagePicturesState: [[], noop],
  isDamageValid: false,
  handleCreateDamageRequest: noop,
  isLoading: false,
  onCameraClose: noop,
  onCameraOpen: noop,
};
export default withTheme(CreateDamageForm);
