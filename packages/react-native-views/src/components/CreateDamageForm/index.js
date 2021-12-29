import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Image, FlatList } from 'react-native';
import { IconButton, DataTable, Button, withTheme, List, TouchableRipple, Portal, Modal, Dialog } from 'react-native-paper';
import { noop, startCase, isEmpty } from 'lodash';

import { utils } from '@monkvision/react-native';

import useToggle from 'hooks/useToggle';
import CameraSimpleView from '../CameraView/CameraSimpleView';
import Drawer from '../Drawer';

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

function CreateDamageForm({ theme, isOpen, handleClose, currentDamage, updateDamageMetaData }) {
  const [isCameraViewOpen, openCameraView, closeCameraView] = useToggle();
  const [damagePictures, setDamagePictures] = useState([]);
  const [isPreviewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(false);

  const openPreviewDialog = useCallback((image) => {
    setPreviewImage(image);
    setPreviewDialogOpen(true);
  }, []);

  return (
    <>
      <Drawer isOpen={isOpen} handleClose={handleClose}>
        <Drawer.Title
          title={`Add photos for ${startCase(currentDamage.damage_type ?? 'damage')} on the ${startCase(currentDamage.part_type ?? 'part')}`}
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
          {!isEmpty(damagePictures) ? damagePictures.map(({ uri }, index) => (
            <TouchableRipple
              key={String(index)}
              onPress={() => openPreviewDialog({ uri, index })}
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
            // onPress={() => openSelectDialog(damageMetadataList.severityTypes)}
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
          //  onPress={createDamageRequest}
            mode="contained"
            style={styles.validationButton}
            icon="shape-square-plus"
          >
            Add damage
          </Button>
        </Drawer.Actions>
      </Drawer>
      <Portal>
        <Modal visible={isCameraViewOpen}>
          <CameraSimpleView
            isLoading={false}
            onTakePicture={(newUri) => setDamagePictures((prev) => [...prev, newUri])}
            onCloseCamera={closeCameraView}
            theme={theme}
            initialPicturesState={damagePictures}
          />
        </Modal>
        {/* <Modal>

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
                  onPress={() => updateDamageMetaData({ field: currentSelectItems.field, value })}
                />
              )}
            />
          </Dialog.ScrollArea>

        </Modal> */}
      </Portal>
      {/* <CustomDialog
        isOpen={selectDialogOpen}
        handleDismiss={handleDismissSelectDialog}
        title="Please select"
        actions={(
          <Button onPress={handleDismissSelectDialog} style={styles.button} mode="outlined">
            Cancel
          </Button>
        )}
      >

      </CustomDialog>

      <ImageViewer
        isOpen={isPreviewDialogOpen}
        images={damagePictures.map((i) => ({ url: i.uri }))}
        index={previewImage.index}
        handleDismiss={handleDismissPreviewDialog}
        deleteButton={(
          <IconButton
            color={theme.colors.error}
            onPress={handleRemovePicture}
            icon={fakeActivity ? undefined : 'trash-can'}
          />
        )}
      /> */}
    </>
  );
}
CreateDamageForm.propTypes = {
  currentDamage: PropTypes.shape({
    damage_type: PropTypes.string,
    part_type: PropTypes.string,
    severity: PropTypes.string,
  }),
  handleClose: PropTypes.func,
  isOpen: PropTypes.bool,
  updateDamageMetaData: PropTypes.func,
};

CreateDamageForm.defaultProps = {
  currentDamage: {
    part_type: null,
    damage_type: null,
    severity: null,
  },
  handleClose: noop,
  updateDamageMetaData: noop,
  isOpen: false,
};
export default withTheme(CreateDamageForm);
