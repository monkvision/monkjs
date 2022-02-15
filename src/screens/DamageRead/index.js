import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import CardContent from 'react-native-paper/src/components/Card/CardContent';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import moment from 'moment';
import isEmpty from 'lodash.isempty';
import startCase from 'lodash.startcase';

import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';
import useRequest from 'hooks/useRequest';

import { spacing } from 'config/theme';

import {
  damagesEntity,
  deleteOneDamage,
  getOneInspectionById,
  imagesEntity,
  inspectionsEntity,
  partsEntity,
  selectDamageById,
  selectDamageEntities,
  selectImageEntities,
  selectInspectionEntities,
  selectPartById,
  selectPartEntities,
  selectTaskEntities,
  taskNames,
  tasksEntity,
  taskStatuses,
} from '@monkvision/corejs';

import { DamageHighlight, usePolygons } from '@monkvision/react-native';

import { SafeAreaView, ScrollView, StyleSheet, View, VirtualizedList } from 'react-native';
import { Button, Card, DataTable, List, TouchableRipple, useTheme } from 'react-native-paper';

import ActionMenu from 'components/ActionMenu';
import CustomDialog from 'components/CustomDialog';
import ImageViewer from 'components/ImageViewer';

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
  button: {
    width: '100%',
    marginVertical: 4,
  },
  alignLeft: {
    justifyContent: 'flex-end',
  },
  buttonLabel: { color: '#FFFFFF' },
  validationButton: {
    margin: spacing(2),
    flex: 1,
  },
});

export default () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const {
    inspectionId,
    id: damageId,
    partId,
  } = route.params;

  const {
    isLoading,
    refresh,
  } = useRequest(getOneInspectionById({ id: inspectionId }));

  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const damagesEntities = useSelector(selectDamageEntities);
  const partsEntities = useSelector(selectPartEntities);
  const tasksEntities = useSelector(selectTaskEntities);

  const currentPart = useSelector(((state) => selectPartById(state, partId)));
  const currentDamage = useSelector(((state) => selectDamageById(state, damageId)));

  const { inspection } = denormalize({ inspection: inspectionId }, {
    inspection: inspectionsEntity,
    images: [imagesEntity],
    damages: [damagesEntity],
    parts: [partsEntity],
    tasks: [tasksEntity],
  }, {
    inspections: inspectionEntities,
    images: imagesEntities,
    damages: damagesEntities,
    parts: partsEntities,
    tasks: tasksEntities,
  });

  const isValidated = useMemo(
    () => inspection.tasks.find(
      (t) => t.name === taskNames.DAMAGE_DETECTION,
    ).status === taskStatuses.VALIDATED,
    [inspection.tasks],
  );

  const [fakeActivity] = useFakeActivity(isLoading);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewPolygons, setPreviewPolygons] = useState(false);
  const [previewImage, setPreviewImage] = useState({});
  const [getImage, getPolygons] = usePolygons();

  const {
    isLoading: isDeleteLoading,
    request: handleDelete,
  } = useRequest(
    deleteOneDamage({
      id: damageId,
      inspectionId,
      partId,
    }),
    {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      },
    },
    false,
  );

  const openDeletionDialog = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleDismissDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  const openPreviewDialog = useCallback((image, polygon) => {
    setPreviewImage(image);
    setPreviewPolygons(polygon);
    setPreviewDialogOpen(true);
  }, []);

  const handleDismissPreviewDialog = useCallback(() => {
    setPreviewDialogOpen(false);
  }, []);

  const menuItems = useMemo(() => [
    {
      title: 'Refresh',
      loading: Boolean(fakeActivity),
      onPress: refresh,
    },
    {
      title: 'Delete',
      onPress: openDeletionDialog,
      disabled: isValidated,
      divider: true,
    },
  ], [fakeActivity, isValidated, openDeletionDialog, refresh]);

  const damageViews = useMemo(
    () => getDamageViews(damageId, inspection?.images ?? []),
    [damageId, inspection.images],
  );

  const damageImages = useMemo(
    () => getDamageImages(damageViews, inspection?.images ?? []),
    [damageViews, inspection.images],
  );

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Damage #${damageId.split('-')[0]}`,
        headerBackVisible: true,
        headerRight: () => (<ActionMenu menuItems={menuItems} />),
      });
    }
  }, [navigation, damageId, menuItems]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }

  return !isEmpty(currentDamage) && (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.root}>
        <Card style={styles.card}>
          <Card.Title
            title={`${startCase(currentDamage.damageType)} on ${startCase(currentPart.partType)}`}
            titleStyle={styles.cardTitle}
            subtitle={`Created ${currentDamage.createdBy === 'algo' ? 'by algo' : 'manually'} at ${moment(currentDamage.createdAt)
              .format('lll')}`}
            left={(props) => (
              <List.Icon
                icon={currentDamage.createdBy === 'algo' ? 'matrix' : 'shape-square-plus'}
                {...props}
              />
            )}
          />
          {!isEmpty(inspection.images) ? (
            <VirtualizedList
              horizontal
              data={damageImages}
              initialNumToRender={10}
              keyExtractor={(item, index) => String(index)}
              getItemCount={(d) => d?.length}
              getItem={(items, index) => items[index]}
              renderItem={({
                item: image,
                index,
              }) => (
                <View syle={styles.images}>
                  <TouchableRipple
                    key={String(index)}
                    onPress={() => {
                      openPreviewDialog(
                        getImage(image),
                        getPolygons(image.id, damageViews)[0],
                      );
                    }}
                  >
                    <DamageHighlight
                      image={getImage(image)}
                      polygons={getPolygons(image.id, damageViews)[0]}
                      backgroundOpacity={0.4}
                      polygonsProps={{
                        opacity: 0.1,
                        stroke: {
                          color: '#ec00ff',
                          strokeWidth: 40,
                        },
                      }}
                    />
                  </TouchableRipple>
                </View>
              )}
            />

          ) : null}

          <CardContent>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Metadata</DataTable.Title>
                <DataTable.Title style={styles.alignLeft}>Value</DataTable.Title>
              </DataTable.Header>
              <DataTable.Row key="metadata-partType">
                <DataTable.Cell>Part type</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>
                  {startCase(currentPart.partType)}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row key="metadata-damageType">
                <DataTable.Cell>Damage type</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>
                  {startCase(currentDamage.damageType)}
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row key="metadata-severity">
                <DataTable.Cell>Severity</DataTable.Cell>
                <DataTable.Cell style={styles.alignLeft}>
                  {currentDamage.severity ?? 'Not given'}
                </DataTable.Cell>
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
              disabled={isValidated}
            >
              Delete damage
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
      <CustomDialog
        isOpen={isDeleteDialogOpen}
        handleDismiss={handleDismissDeleteDialog}
        title="Confirm damage deletion"
        content="Are you sure that you really really want to DELETE this damage ?"
        actions={(
          <>
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
            <Button onPress={handleDismissDeleteDialog} style={styles.button} mode="outlined">
              Cancel
            </Button>
          </>
        )}
      />
      <ImageViewer
        isOpen={isPreviewDialogOpen}
        images={inspection.images.map((i) => ({ url: i.path }))}
        index={previewImage.index}
        image={previewImage}
        polygons={previewPolygons}
        handleDismiss={handleDismissPreviewDialog}
      />
    </SafeAreaView>
  );
};
