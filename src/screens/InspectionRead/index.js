import React, { useCallback, useLayoutEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import CardContent from 'react-native-paper/src/components/Card/CardContent';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';

import moment from 'moment';
import startCase from 'lodash.startcase';
import isEmpty from 'lodash.isempty';

import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';
import useRequest from 'hooks/useRequest';
import Img from 'components/Img';
import { spacing } from 'config/theme';

import {
  damagesEntity,
  deleteOneInspection,
  getOneInspectionById,
  selectDamageEntities,
  selectInspectionEntities,
  selectImageEntities,
  selectPartEntities,
  selectTaskEntities,
  selectVehicleEntities,
  imagesEntity,
  inspectionsEntity,
  tasksEntity,
  taskStatuses,
  vehiclesEntity,
} from '@monkvision/corejs';

import Drawing from 'components/Drawing';
import { StyleSheet, SafeAreaView, ScrollView, View, Platform } from 'react-native';
import {
  Card,
  Button,
  Dialog,
  Paragraph,
  Portal,
  useTheme,
  Chip,
  Subheading,
  Text,
  Title,
  TouchableRipple,
} from 'react-native-paper';

import ActionMenu from 'components/ActionMenu';
import ImageViewer from 'components/ImageViewer';
import LogoIcon from 'components/Icons/LogoIcon';

import { DAMAGES, LANDING, TASK_READ, INSPECTION_UPDATE } from 'screens/names';

import trash from './assets/trash.svg';
import process from './assets/process.svg';

const styles = StyleSheet.create({
  root: {
    paddingVertical: spacing(1),
  },
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
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
    paddingLeft: spacing(2),
  },
  tasks: {
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'row',
    flexShrink: 0,
    flexWrap: 'nowrap',
    marginBottom: spacing(2),
  },
  image: {
    width: 200,
    height: 150,
    marginRight: spacing(2),
  },
  previewImage: {
    flex: 1,
    width: 400,
    height: 400,
    marginHorizontal: spacing(0),
  },
  dialog: {
    maxWidth: 450,
    alignSelf: 'center',
    padding: 12,
  },
  dialogDrawing: { display: 'flex', alignItems: 'center' },
  dialogContent: { textAlign: 'center' },
  dialogActions: { flexWrap: 'wrap' },
  button: { width: '100%', marginVertical: 4 },
  actionButton: { marginLeft: spacing(1) },

  process: {
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flexGrow: 1, minHeight: 'calc(100vh - 64px)' },
    }),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    margin: spacing(2),
  },
  processButton: {
    margin: spacing(1),
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  logo: {
    ...Platform.select({
      native: { marginLeft: 0, marginRight: spacing(1) },
      default: { marginLeft: spacing(2) },
    }),
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } : {}),
  },
  title: {
    lineHeight: 20,
  },
  subheading: {
    fontSize: 14,
    lineHeight: 14,
  },
});

const taskChipIcons = {
  [taskStatuses.NOT_STARTED]: 'clock-alert-outline',
  [taskStatuses.TODO]: 'av-timer',
  [taskStatuses.IN_PROGRESS]: 'clock-outline',
  [taskStatuses.DONE]: 'check-circle-outline',
  [taskStatuses.ERROR]: 'alert-circle-outline',
  [taskStatuses.ABORTED]: 'progress-close',
  [taskStatuses.VALIDATED]: 'check',
};

export default () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();

  const { inspectionId } = route.params;

  const { isLoading, refresh } = useRequest(getOneInspectionById({ id: inspectionId }));

  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const damagesEntities = useSelector(selectDamageEntities);
  const partsEntities = useSelector(selectPartEntities);
  const tasksEntities = useSelector(selectTaskEntities);
  const vehiclesEntities = useSelector(selectVehicleEntities);

  const { inspection } = denormalize({ inspection: inspectionId }, {
    inspection: inspectionsEntity,
    images: [imagesEntity],
    damages: [damagesEntity],
    tasks: [tasksEntity],
    vehicles: [vehiclesEntity],
  }, {
    inspections: inspectionEntities,
    images: imagesEntities,
    damages: damagesEntities,
    parts: partsEntities,
    tasks: tasksEntities,
    vehicles: vehiclesEntities,
  });

  const [fakeActivity] = useFakeActivity(isLoading);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState({});

  const { request: handleDelete } = useRequest(
    deleteOneInspection({ id: inspectionId }),
    { onSuccess: () => {
      setDialogOpen(false);
      navigation.navigate(LANDING);
    } },
    false,
  );

  const handleShowDamages = useCallback(() => {
    navigation.navigate(DAMAGES, { inspectionId });
  }, [inspectionId, navigation]);

  const openDeletionDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleDismissDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleGoToTaskRead = useCallback(
    (args) => {
      navigation.navigate(TASK_READ, { ...args, inspectionId });
    },
    [navigation, inspectionId],
  );

  const handleExportPdf = useCallback(() => {}, []);
  const handleGoToEditInspection = useCallback(() => {
    navigation.navigate(INSPECTION_UPDATE);
  }, [navigation]);

  const openPreviewDialog = useCallback((image) => {
    setPreviewImage(image);
    setPreviewDialogOpen(true);
  }, []);

  const handleDismissPreviewDialog = useCallback(() => {
    setPreviewDialogOpen(false);
  }, []);

  const menuItems = useMemo(() => [
    { title: 'Refresh', loading: Boolean(fakeActivity), onPress: refresh, icon: 'refresh' },
    { title: 'Edit', onPress: handleGoToEditInspection, icon: 'file-document-edit', disabled: true },
    { title: 'Export as PDF', onPress: handleExportPdf, icon: 'pdf-box', disabled: true },
    { title: 'Delete', onPress: openDeletionDialog, icon: 'trash-can', divider: true },
  ], [fakeActivity, handleExportPdf, handleGoToEditInspection, openDeletionDialog, refresh]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: isEmpty(inspection) ? `Inspection #${inspectionId.split('-')[0]}` : (
          `${inspection.vehicle?.brand || 'Brand'} ${inspection?.vehicle?.model || 'Model'} ${moment(inspection.createdAt).format('lll')}`
        ),
        headerTitle: () => {
          if (isEmpty(inspection)) {
            return (
              <Title>
                Inspection
                {`#${inspectionId.split('-')[0]}`}
              </Title>
            );
          }

          return (
            <View>
              <Title style={styles.title}>
                {inspection.vehicle?.brand || 'Brand'}
                {` `}
                {inspection.vehicle?.model || 'Model'}
              </Title>
              <Subheading style={styles.subheading}>
                {moment(inspection.createdAt).format('lll')}
              </Subheading>
            </View>
          );
        },
        headerBackVisible: false,
        headerLeft: () => (
          <LogoIcon
            width={44}
            height={44}
            style={styles.logo}
            alt="Return home"
            onClick={() => navigation.navigate(LANDING)}
            onPress={() => navigation.navigate(LANDING)}
          />
        ),
        headerRight: () => (
          <ActionMenu menuItems={menuItems} />
        ),
      });
    }
  }, [inspection, inspectionId, menuItems, navigation]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }

  if (isEmpty(inspection) || isEmpty(inspection.tasks) || inspection.tasks[0].status === 'IN_PROGRESS') {
    return (
      <View style={styles.process}>
        <Drawing xml={process} height={200} />
        <Text style={styles.text}>
          Inspection is still processing...
        </Text>
        <View style={styles.actions}>
          <Button
            icon="refresh"
            onPress={refresh}
            loading={fakeActivity}
            disabled={fakeActivity}
            mode="contained"
            style={styles.processButton}
          >
            Refresh
          </Button>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.root}>
        <Card style={styles.card}>
          <Card.Title
            title="Inspection report"
            subtitle={`#${inspectionId}`}
            right={() => ((!isEmpty(inspection.damages)) ? (
              <Button
                icon="image-broken-variant"
                onPress={handleShowDamages}
                color={theme.colors.warning}
                mode="contained"
                labelStyle={{ color: '#fff' }}
                style={{ marginRight: spacing(1) }}
              >
                {`${inspection.damages.length} damage${inspection.damages.length > 1 ? 's' : ''}`}
              </Button>
            ) : <Text style={{ marginRight: spacing(1) }}>NO DAMAGES</Text>)}
          />
          {!isEmpty(inspection.tasks) && (
            <CardContent>
              <ScrollView contentContainerStyle={styles.tasks} horizontal>
                {inspection.tasks.map(({ createdAt, doneAt, id, name, status }) => (
                  <Chip
                    key={`taskChip-${id}`}
                    icon={taskChipIcons[status]}
                    onPress={() => handleGoToTaskRead({ taskName: name, taskId: id })}
                    style={{ margin: 2 }}
                  >
                    {startCase(name)}
                    {' '}
                    {doneAt && createdAt ? `(${moment.duration(moment(doneAt).diff(moment(createdAt))).seconds()}s)` : null}
                  </Chip>
                ))}
              </ScrollView>
            </CardContent>
          )}
        </Card>
      </ScrollView>
      <ScrollView contentContainerStyle={styles.images} horizontal>
        {!isEmpty(inspection.images) ? inspection.images.map(({ name, path }) => (
          <TouchableRipple
            key={name + path}
            onPress={() => openPreviewDialog({ name, path })}
          >
            <Img
              style={styles.image}
              skeletonStyle={styles.image}
              source={{ uri: path }}
            />
          </TouchableRipple>
        )) : null}
      </ScrollView>
      <Portal>
        <Dialog
          visible={Boolean(isDialogOpen)}
          onDismiss={handleDismissDialog}
          style={styles.dialog}
        >
          <View style={styles.dialogDrawing}>
            <Drawing xml={trash} width="200" height="120" />
          </View>
          <Dialog.Title style={styles.dialogContent}>
            Are you sure?
          </Dialog.Title>

          <Dialog.Content>
            <Paragraph style={styles.dialogContent}>
              You
              {'\''}
              re about to delete an inspection, there is no going back in this action.
            </Paragraph>
          </Dialog.Content>

          <Dialog.Actions style={styles.dialogActions}>
            <Button onPress={handleDismissDialog} style={styles.button} mode="outlined">
              Cancel
            </Button>
            <Button
              color={theme.colors.error}
              style={styles.button}
              onPress={handleDelete}
              mode="contained"
              icon={isLoading ? undefined : 'trash-can'}
              labelStyle={{ color: 'white' }}
              loading={isLoading}
              disabled={isLoading}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {!isEmpty(inspection.images) && (
        <ImageViewer
          isOpen={isPreviewDialogOpen}
          images={inspection.images.map((i) => ({ url: i.path }))}
          index={previewImage.index}
          handleDismiss={handleDismissPreviewDialog}
        />
      )}
    </SafeAreaView>
  );
};
