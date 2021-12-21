import React, { useCallback, useLayoutEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import CardContent from 'react-native-paper/src/components/Card/CardContent';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import moment from 'moment';
import isEmpty from 'lodash.isempty';

import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';
import useRequest from 'hooks/useRequest';

import { spacing } from 'config/theme';

import {
  damagesEntity,
  deleteOneDamage,
  getOneInspectionById,
  selectDamageById,
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
  useTheme,
  DataTable,
  List,
  TouchableRipple,
} from 'react-native-paper';

import ActionMenu from 'components/ActionMenu';
import CustomDialog from 'components/CustomDialog';
import DamagePolygon from './DamagePolygon';

const getDamageViews = (damageId, images) => {
  const damageViews = images.map((img) => img.views?.filter((v) => v.element_id === damageId))
    .filter((dmgViews) => !isEmpty(dmgViews));
  return damageViews.concat.apply([], damageViews);
};

const getDamageImages = (damageViews, images) => damageViews.map(
  (dmgView) => images.find((img) => img.id === dmgView.image_region?.image_id),
);

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
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { inspectionId, id: damageId, partType } = route.params;

  const { isLoading, refresh } = useRequest(getOneInspectionById({ id: inspectionId }));

  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const damagesEntities = useSelector(selectDamageEntities);
  const partsEntities = useSelector(selectPartEntities);

  const currentDamage = useSelector(((state) => selectDamageById(state, damageId)));

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

  const [fakeActivity] = useFakeActivity(isLoading);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState({});

  const { isLoading: isDeleteLoading, request: handleDelete } = useRequest(
    deleteOneDamage({ id: damageId, inspectionId }),
    { onSuccess: () => {
      setDeleteDialogOpen(false);
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } },
    false,
  );

  const openDeletionDialog = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleDismissDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
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
    { title: 'Delete', titleStyle: { color: colors.warning }, onPress: openDeletionDialog, divider: true },
  ], [colors.warning, fakeActivity, openDeletionDialog, refresh]);

  const damageViews = useMemo(() => getDamageViews(damageId, inspection?.images ?? []),
    [damageId, inspection.images]);
  const damageImages = useMemo(() => getDamageImages(damageViews, inspection?.images ?? []),
    [damageViews, inspection.images]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Damage #${damageId.split('-')[0]}`,
        headerBackVisible: true,
        headerRight: () => (<ActionMenu menuItems={menuItems} />),
      });
    }
  }, [fakeActivity, navigation, refresh, openDeletionDialog, damageId, menuItems, partType]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }

  return !isEmpty(currentDamage) && (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.root}>
        <Card style={styles.card}>
          <Card.Title
            title={`${currentDamage.damageType} on ${partType} with id: #${currentDamage.id.split('-')[0]}`}
            titleStyle={styles.cardTitle}
            subtitle={`Created ${currentDamage.createdBy === 'algo' ? 'by algo' : 'manually'} at ${moment(currentDamage.createdAt).format('lll')}`}
            onClick={() => {}}
            left={(props) => <List.Icon {...props} icon={currentDamage.createdBy === 'algo' ? 'matrix' : 'shape-square-plus'} />}
          />
          <ScrollView contentContainerStyle={styles.images} horizontal>
            {!isEmpty(inspection.images) ? damageImages.map((image) => (
              <TouchableRipple
                key={image.name}
                onPress={() => openPreviewDialog({ name: image.name, path: image.path })}
              >
                <DamagePolygon
                  style={styles.image}
                  currentImage={image}
                  views={damageViews.filter((view) => view.image_region?.image_id === image.id)}
                />
              </TouchableRipple>
            )) : null}
          </ScrollView>
          <CardContent>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Metadata</DataTable.Title>
                <DataTable.Title style={styles.alignLeft}>Value</DataTable.Title>
              </DataTable.Header>
              <DataTable.Row key="metadata-partType">
                <DataTable.Cell>Part type</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>{partType}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row key="metadata-damageType">
                <DataTable.Cell>Damage type</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>{currentDamage.damageType}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row key="metadata-severity">
                <DataTable.Cell>Severity</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>{ currentDamage.severity ?? 'Not given' }</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </CardContent>
          <Card.Actions style={styles.cardActions}>
            <Button
              color={colors.warning}
              labelStyle={styles.buttonLabel}
              onPress={openDeletionDialog}
              mode="contained"
              style={styles.validationButton}
              icon="delete"
              loading={isLoading}
            >
              Delete damage
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
      <CustomDialog
        isOpen={isDeleteDialogOpen}
        handDismiss={handleDismissDeleteDialog}
        icon={<Button icon="alert" size={36} color={colors.warning} />}
        title="Confirm damage deletion"
        content="Are you sure that you really really want to DELETE this damage ?"
        actions={(
          <>
            <Button onPress={handleDismissDeleteDialog} style={styles.button} mode="outlined">
              Cancel
            </Button>
            <Button
              color={colors.error}
              style={styles.button}
              onPress={handleDelete}
              mode="contained"
              icon={isLoading ? undefined : 'trash-can'}
              labelStyle={{ color: 'white' }}
              loading={isDeleteLoading}
              disabled={isDeleteLoading}
            >
              Delete
            </Button>
          </>
        )}
      />
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
