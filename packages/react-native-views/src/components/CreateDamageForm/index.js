import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Image, FlatList } from 'react-native';
import { IconButton, DataTable, Button, withTheme, List, TouchableRipple, Portal, Modal, Dialog, Divider } from 'react-native-paper';
import { noop, startCase, isEmpty } from 'lodash';

import { utils } from '@monkvision/react-native';

import useToggle from 'hooks/useToggle';
import { ImageViewer, Drawer } from '..';
import CameraSimpleView from '../CameraView/CameraSimpleView';
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
  buttonLabel: { color: '#FFFFFF' },
  validationButton: { margin: spacing(2), flex: 1 },
  divider: { opacity: 0.3 },
  cameraIcon: { marginRight: spacing(4) },
});
  // handleDismissSelectDialog();
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

  const wrapTitles = useMemo(() => {
    if (currentDamage.damage_type) { return startCase(currentDamage.damage_type); }
    return 'a damage';
  }, [currentDamage.damage_type]);

  const wrapSubtitles = useMemo(() => {
    if (currentDamage.part_type) { return `On the ${startCase(currentDamage.part_type)} part`; }
    return 'On a part';
  }, [currentDamage.part_type]);

  if (isEmpty(currentDamage)) { return null; }
  return (
    <>
      <Drawer isOpen={isOpen} handleClose={handleClose}>
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

        <ScrollView style={{ height: 500 }}>
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
                <DataTable.Cell>Part type</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>
                  {startCase(currentDamage.part_type) ?? 'Not given'}
                  <DataTable.Cell style={styles.alignLeft}>
                    <IconButton
                      icon="pencil"
                      disabled
                    />
                  </DataTable.Cell>
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row
                key="metadata-damageType"
                onPress={() => handleOpenSelectDialog(damageMetadataList.damageTypes)}
              >
                <DataTable.Cell>Damage type</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>
                  {startCase(currentDamage.damage_type) ?? 'Not given'}
                  <DataTable.Cell style={styles.alignLeft}>
                    <IconButton
                      icon="pencil"
                      disabled
                    />
                  </DataTable.Cell>
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row
                key="metadata-severity"
                onPress={() => handleOpenSelectDialog(damageMetadataList.severityTypes)}
                disabled
              >
                <DataTable.Cell>Severity</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>
                  {currentDamage.severity ?? 'Not given' }
                  <DataTable.Cell style={styles.alignLeft}>
                    <IconButton
                      icon="pencil"
                      disabled
                    />
                  </DataTable.Cell>

                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </Drawer.Content>
          <Drawer.Actions style={styles.cardActions}>
            <Button
          // color={theme.colors.primary}
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
        <Modal visible={isCameraViewOpen}>
          <CameraSimpleView
            isLoading={false}
            onTakePicture={noop}
            onCloseCamera={(pictures) => { closeCameraView(); setDamagePictures(pictures); }}
            theme={theme}
            initialPicturesState={damagePictures}
          />
        </Modal>
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
};
export default withTheme(CreateDamageForm);
