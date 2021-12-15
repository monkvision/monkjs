import React, { useCallback, useLayoutEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import CardContent from 'react-native-paper/src/components/Card/CardContent';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import isEmpty from 'lodash.isempty';

import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';
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

import { Image, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import {
  Card,
  Button,
  IconButton,
  useTheme,
  DataTable,
  List,
  TouchableRipple,
} from 'react-native-paper';

import ActionMenu from 'components/ActionMenu';
import CustomDialog from 'components/CustomDialog';

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
  button: { width: '100%', marginVertical: 4 },
  alignLeft: {
    justifyContent: 'flex-end',
  },
  buttonLabel: { color: '#FFFFFF' },
  validationButton: { margin: spacing(2), flex: 1 },
});

export default () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();

  const { inspectionId, imageId, partType } = route.params;

  const { isLoading, refresh } = useRequest(getOneInspectionById({ id: inspectionId }));

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

  const currentImage = useMemo(() => inspection?.images?.filter((i) => i.id === imageId),
    [imageId, inspection?.images]);

  const [currentDamage, updateDamage] = useState({
    inspection_id: inspectionId,
    part_type: partType,
    damage_type: undefined,
    severity: undefined,
  });

  const [damageViews, setDamageViews] = useState([]);

  const [fakeActivity] = useFakeActivity(isLoading);
  const [isEditable, setIsEditable] = useState(true);
  const [isPreviewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState({});

  const openCamera = useCallback(() => {

  }, []);

  const handleAddViewPicture = useCallback(() => {

  }, []);

  const handleCreateDamage = useCallback(() => {

  }, []);

  const openPreviewDialog = useCallback((image) => {
    setPreviewImage(image);
    setPreviewDialogOpen(true);
  }, []);

  const handleDismissPreviewDialog = useCallback(() => {
    setPreviewDialogOpen(false);
  }, []);

  const menuItems = useMemo(() => [
    { title: 'Refresh', loading: Boolean(fakeActivity), onPress: refresh },
  ], [fakeActivity, refresh]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Add damage to inspection part`,
        headerBackVisible: true,
        headerRight: () => (<ActionMenu menuItems={menuItems} />),
      });
    }
  }, [menuItems, navigation]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }

  const EditButton = (onPress) => (
    <DataTable.Cell style={styles.alignLeft}>
      <IconButton
        icon="pencil"
        disabled={!isEditable}
        color={theme.colors.grey}
        onPress={onPress}
      />
    </DataTable.Cell>
  );

  return !isEmpty(currentDamage) && (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.root}>
        <Card style={styles.card}>
          <Card.Title
            title={`Add ${currentDamage.damage_type ?? 'damage'} on ${currentDamage.part_type ?? 'part'}`}
            titleStyle={styles.cardTitle}
            onClick={() => {}}
            left={(props) => <List.Icon {...props} icon="shape-square-plus" />}
            right={() => (isEditable ? (
              <IconButton
                icon="camera-plus"
                size={30}
                color={theme.colors.primary}
                onPress={() => {}}
              />
            ) : null)}
          />

          { currentImage && (<Image style={styles.image} source={{ uri: currentImage?.path }} />) }

          <ScrollView contentContainerStyle={styles.images} horizontal>
            {!isEmpty(damageViews) ? damageViews.map(({ name, path }) => (
              <TouchableRipple key={name} onPress={() => openPreviewDialog({ name, path })}>
                <Image style={styles.image} source={{ uri: path }} />
              </TouchableRipple>
            )) : null}
          </ScrollView>
          <CardContent>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Metadata</DataTable.Title>
                <DataTable.Title>Value</DataTable.Title>
                {isEditable && (
                <DataTable.Title style={styles.alignLeft} disabled>Edit</DataTable.Title>
                )}
              </DataTable.Header>

              <DataTable.Row key="metadata-partType">
                <DataTable.Cell> Part type </DataTable.Cell>
                <DataTable.Cell>{currentDamage.part_type ?? 'Not given'}</DataTable.Cell>
                {isEditable && (<EditButton onPress={() => {}} />)}
              </DataTable.Row>
              <DataTable.Row key="metadata-severity">
                <DataTable.Cell>Severity</DataTable.Cell>
                <DataTable.Cell>{ currentDamage.severity ?? 'Not given' }</DataTable.Cell>
                {isEditable && (<EditButton onPress={() => {}} />)}
              </DataTable.Row>
            </DataTable>
          </CardContent>
          <Card.Actions style={styles.cardActions}>
            <Button
              color={theme.colors.success}
              labelStyle={styles.buttonLabel}
              onPress={handleCreateDamage}
              mode="contained"
              style={styles.validationButton}
              icon="shape-square-plus"
              loading={isLoading}
            >
              Create damage
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
      <CustomDialog
        isOpen={isPreviewDialogOpen}
        handDismiss={handleDismissPreviewDialog}
        actions={(
          <Button onPress={handleDismissPreviewDialog} style={styles.button} mode="outlined">
            Close
          </Button>
        )}
      >
        <Image style={styles.previewImage} source={{ uri: previewImage.path }} />
      </CustomDialog>
    </SafeAreaView>
  );
};
