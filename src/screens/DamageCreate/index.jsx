import React, { useCallback, useLayoutEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import CardContent from 'react-native-paper/src/components/Card/CardContent';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import isEmpty from 'lodash.isempty';

import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';
import CameraSimpleView from '@monkvision/react-native-views/src/components/CameraView/CameraSimpleView';
import useRequest from 'hooks/useRequest';

import { spacing } from 'config/theme';

import {
  damagesEntity,
  getOneInspectionById,
  selectDamageEntities,
  selectInspectionEntities,
  selectImageEntities,
  selectPartEntities,
  imagesEntity,
  inspectionsEntity,
} from '@monkvision/corejs';

import { Image, StyleSheet, SafeAreaView, ScrollView, FlatList } from 'react-native';
import {
  Card,
  Button,
  IconButton,
  useTheme,
  DataTable,
  TouchableRipple,
  List,
  Divider,
  Dialog,
} from 'react-native-paper';

import ActionMenu from 'components/ActionMenu';
import CustomDialog from 'components/CustomDialog';
import damageMetadataList from './metadataList';

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
});

export default () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const partType = route.params?.partType;
  const inspectionId = '5ff7fbeb-e31e-d44a-5f9d-5994e438da56';// route.params?.inspectionId,

  // const { isLoading, refresh } = useRequest(getOneInspectionById({ id: inspectionId }));
  const isLoading = false;
  const refresh = () => {};

  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const damagesEntities = useSelector(selectDamageEntities);
  const partsEntities = useSelector(selectPartEntities);

  const { inspection } = denormalize({ inspection: inspectionId }, {
    inspection: inspectionsEntity,
    images: [imagesEntity],
    damages: [damagesEntity],
  }, {
    inspections: inspectionEntities,
    images: imagesEntities,
    damages: damagesEntities,
    parts: partsEntities,
  });

  const [currentDamage, setCurrentDamage] = useState({
    inspection_id: inspectionId,
    part_type: partType,
    damage_type: undefined,
    severity: undefined,
  });

  const [damagePictures, setDamagePictures] = useState([]);
  const [fakeActivity] = useFakeActivity(isLoading);
  const [isPreviewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [isCameraViewOpen, setCameraViewOpen] = useState(false);
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState({});
  const [currentSelectItems, setCurrentSelectItems] = useState({ field: undefined, values: [] });

  const menuItems = useMemo(() => [
    { title: 'Refresh', loading: Boolean(fakeActivity), onPress: refresh },
  ], [fakeActivity, refresh]);

  const handleOpenCamera = useCallback(() => {
    setCameraViewOpen(true);
    navigation?.setOptions({ headerShown: false });
  }, [navigation]);

  const handleCloseCamera = useCallback((pictures) => {
    setDamagePictures(pictures);
    setCameraViewOpen(false);
    navigation?.setOptions({ headerShown: true });
  }, [navigation]);

  const handleTakePicture = useCallback((picture) => {
    // TODO directly upload image and create the damage View?
  }, []);

  const handleRemovePicture = useCallback(() => {
    // Remove taken picture
    setDamagePictures((old) => old.filter((_p, i) => i !== previewImage.index));
    setPreviewDialogOpen(false);
    setPreviewImage({});
  }, [previewImage]);

  const openPreviewDialog = useCallback((image) => {
    setPreviewImage(image);
    setPreviewDialogOpen(true);
  }, []);

  const handleDismissPreviewDialog = useCallback(() => {
    setPreviewDialogOpen(false);
  }, []);

  const openSelectDialog = useCallback((fieldValues) => {
    setCurrentSelectItems(fieldValues);
    setSelectDialogOpen(true);
  }, []);

  const handleDismissSelectDialog = useCallback(() => {
    setSelectDialogOpen(false);
    setCurrentSelectItems({ field: undefined, values: [] });
  }, []);

  const updateDamageMetaData = useCallback(({ field, value }) => {
    setCurrentDamage((old) => ({ ...old, [field]: value }));
    handleDismissSelectDialog();
  }, [handleDismissSelectDialog]);

  const handleCreateDamage = useCallback(() => {

  }, []);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Add damage to inspection part`,
        headerBackVisible: true,
        headerRight: () => <ActionMenu menuItems={menuItems} />,
      });
    }
  }, [menuItems, navigation]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }

  const EditButton = (onPress, disabled) => (
    <DataTable.Cell style={styles.alignLeft}>
      <IconButton
        icon="pencil"
        disabled={disabled}
        color={theme.colors.grey}
        onPress={onPress}
      />
    </DataTable.Cell>
  );

  if (isCameraViewOpen) {
    return (
      <>
        <CameraSimpleView
          isLoading={fakeActivity}
          onTakePicture={handleTakePicture}
          onCloseCamera={handleCloseCamera}
          theme={theme}
          initialPicturesState={damagePictures}
        />
      </>
    );
  }

  return !isEmpty(currentDamage) && (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.root}>
        <Card style={styles.card}>
          <Card.Title
            title={`Please add photos of the ${currentDamage.damage_type ?? 'damage'} on the ${currentDamage.part_type ?? 'part'}`}
            titleStyle={styles.cardTitle}
            onClick={() => {}}
            left={(props) => <List.Icon {...props} icon="shape-square-plus" />}
            right={() => (
              <IconButton
                icon="camera-plus"
                size={30}
                color={theme.colors.primary}
                onPress={handleOpenCamera}
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
          <CardContent>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Add damage Metadata</DataTable.Title>
                <DataTable.Title style={styles.alignLeft}>Value</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row
                key="metadata-partType"
                onPress={() => openSelectDialog(damageMetadataList.partTypes)}
              >
                <DataTable.Cell> Part type </DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>
                  {currentDamage.part_type ?? 'Not given'}
                  <EditButton disabled />
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row
                key="metadata-damageType"
                onPress={() => openSelectDialog(damageMetadataList.damageTypes)}
              >
                <DataTable.Cell> Damage type </DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>
                  {currentDamage.damage_type ?? 'Not given'}
                  <EditButton disabled />
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row
                key="metadata-severity"
                onPress={() => openSelectDialog(damageMetadataList.severityTypes)}
              >
                <DataTable.Cell>Severity</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>
                  { currentDamage.severity ?? 'Not given' }
                  <EditButton disabled />
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </CardContent>
          <Card.Actions style={styles.cardActions}>
            <Button
              color={theme.colors.primary}
              labelStyle={styles.buttonLabel}
              onPress={handleCreateDamage}
              mode="contained"
              style={styles.validationButton}
              icon="shape-square-plus"
              loading={isLoading}
            >
              Add damage
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      <CustomDialog
        isOpen={selectDialogOpen}
        handDismiss={handleDismissSelectDialog}
        title="Please select"
        actions={(
          <Button onPress={handleDismissSelectDialog} style={styles.button} mode="outlined">
            Cancel
          </Button>
        )}
      >
        <Dialog.ScrollArea style={styles.scrollArea}>
          <FlatList
            style={[styles.flatList]}
            data={currentSelectItems.values}
            keyExtractor={(_item, index) => String(index)}
            ListHeaderComponent={() => (
              <List.Subheader theme={theme}>
                { currentSelectItems.field }
              </List.Subheader>
            )}
            ItemSeparatorComponent={() => (<Divider style={styles.divider} />)}
            renderItem={({ item: value }) => (
              <List.Item
                title={value}
                theme={theme}
                titleEllipsizeMode="middle"
                onPress={() => updateDamageMetaData({ field: currentSelectItems.field, value })}
              />
            )}
          />
        </Dialog.ScrollArea>
      </CustomDialog>

      <CustomDialog
        isOpen={isPreviewDialogOpen}
        handDismiss={handleDismissPreviewDialog}
        actions={(
          <>
            <Button onPress={handleDismissPreviewDialog} style={styles.button} mode="outlined">
              Cancel
            </Button>
            <Button
              color={theme.colors.error}
              style={styles.button}
              onPress={handleRemovePicture}
              mode="contained"
              icon={isLoading ? undefined : 'trash-can'}
              labelStyle={{ color: 'white' }}
            >
              Delete
            </Button>
          </>
        )}
      >
        <Image style={styles.previewImage} source={{ uri: previewImage.uri }} />
      </CustomDialog>
    </SafeAreaView>
  );
};
