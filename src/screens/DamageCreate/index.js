import React, { useCallback, useLayoutEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import useRequest from 'hooks/useRequest';

import { spacing } from 'config/theme';
import isEmpty from 'lodash.isempty';
import startCase from 'lodash.startcase';

import { createOneDamage, addOneViewToInspection, config } from '@monkvision/corejs';

import { Image, StyleSheet, SafeAreaView, ScrollView, FlatList, Platform } from 'react-native';
import { ActivityIndicatorView, CameraSimpleView, useFakeActivity } from '@monkvision/react-native-views';

import CustomDialog from 'components/CustomDialog';
import ImageViewer from 'components/ImageViewer';

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
  cameraIcon: { marginRight: spacing(4) },
});

export default () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const partType = route.params?.partType;
  const inspectionId = route.params?.inspectionId;
  const dispatch = useDispatch();

  const [currentDamage, setCurrentDamage] = useState({
    part_type: partType,
    damage_type: undefined,
    // severity: undefined,
  });

  const [damagePictures, setDamagePictures] = useState([]);
  const [isPreviewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [isCameraViewOpen, setCameraViewOpen] = useState(false);
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState({});
  const [currentSelectItems, setCurrentSelectItems] = useState({ field: undefined, values: [] });
  const [isUploading, setUploading] = useState(false);

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const handleAddViewPicture = useCallback(async (viewPicture, index) => {
    if (!inspectionId || !viewPicture.viewData) { return; }

    setUploading(true);

    const filename = `${currentDamage.id}-${index}-${inspectionId}.jpg`;
    const multiPartKeys = { image: 'image', json: 'json', filename, type: 'image/jpg' };

    const headers = { ...config.axiosConfig, 'Content-Type': 'multipart/form-data' };
    const baseParams = { inspectionId, headers };

    const acquisition = { strategy: 'upload_multipart_form_keys', file_key: multiPartKeys.image };
    const json = JSON.stringify({
      ...viewPicture.viewData,
      new_image: { name: multiPartKeys.filename, acquisition },
    });

    const data = new FormData();
    data.append(multiPartKeys.json, json);

    if (Platform.OS === 'web') {
      const response = await fetch(viewPicture.source.base64);
      const blob = await response.blob();
      const file = await new File([blob], multiPartKeys.filename, { type: multiPartKeys.type });
      data.append(multiPartKeys.image, file);
    } else {
      data.append('image', {
        uri: viewPicture.source.uri,
        name: multiPartKeys.filename,
        type: multiPartKeys.type,
      });
    }

    await dispatch(addOneViewToInspection({ ...baseParams, data })).unwrap();
  }, [currentDamage.id, dispatch, inspectionId]);

  const createDamageViews = useCallback(async (damageId) => {
    if (isEmpty(damagePictures) || !damageId) {
      handleGoBack();
      return;
    }
    const viewsPromises = [];
    setUploading(true);
    damagePictures.forEach((source, i) => viewsPromises.push(
      handleAddViewPicture({
        source,
        viewData: {
          damage_id: damageId,
          // polygons: [[[0]]], // TODO
          // bounding_box: { xmin: 0, ymin: 0, width: 0, height: 0 }, // TODO
        },
      }, i),
    ));
    Promise.all(viewsPromises)
      .then(() => {
        setUploading(false);
        handleGoBack();
      })
      .catch(() => setUploading(false));
  }, [damagePictures, handleAddViewPicture, handleGoBack]);

  const { isLoading, request: createDamageRequest } = useRequest(
    createOneDamage({ inspectionId, data: currentDamage }),
    { onSuccess: ({ result: id }) => {
      setCurrentDamage((old) => ({ ...old, id }));
      createDamageViews(id);
    } },
    false,
  );

  const isDamageValid = useMemo(() => currentDamage.part_type && currentDamage.damage_type,
    [currentDamage.damage_type, currentDamage.part_type]);

  const [fakeActivity] = useFakeActivity(isLoading || isUploading);

  const handleOpenCamera = useCallback(() => {
    setCameraViewOpen(true);
    navigation?.setOptions({ headerShown: false });
  }, [navigation]);

  const handleCloseCamera = useCallback((pictures) => {
    setDamagePictures(pictures);
    setCameraViewOpen(false);
    navigation?.setOptions({ headerShown: true });
  }, [navigation]);

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

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Add damage on vehicle part`,
        headerBackVisible: true,
      });
    }
  }, [navigation]);

  if (fakeActivity) {
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
          onTakePicture={() => {}}
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
          <Card.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Add damage Metadata</DataTable.Title>
                <DataTable.Title style={styles.alignLeft}>Value</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row
                key="metadata-partType"
                onPress={() => openSelectDialog(damageMetadataList.partTypes)}
              >
                <DataTable.Cell>Part type</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>
                  {startCase(currentDamage.part_type) ?? 'Not given'}
                  <EditButton disabled />
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row
                key="metadata-damageType"
                onPress={() => openSelectDialog(damageMetadataList.damageTypes)}
              >
                <DataTable.Cell>Damage type</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>
                  {startCase(currentDamage.damage_type) ?? 'Not given'}
                  <EditButton disabled />
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row
                key="metadata-severity"
                onPress={() => openSelectDialog(damageMetadataList.severityTypes)}
                disabled
              >
                <DataTable.Cell>Severity</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>
                  { currentDamage.severity ?? 'Not given' }
                  <EditButton disabled />
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button
              color={theme.colors.primary}
              labelStyle={styles.buttonLabel}
              onPress={createDamageRequest}
              mode="contained"
              style={styles.validationButton}
              icon="shape-square-plus"
              loading={fakeActivity}
              disabled={!isDamageValid}
            >
              Add damage
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      <CustomDialog
        isOpen={selectDialogOpen}
        handleDismiss={handleDismissSelectDialog}
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
                { startCase(currentSelectItems.field) }
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
      />
    </SafeAreaView>
  );
};
