import useRequest from 'hooks/useRequest';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
  VirtualizedList,
} from 'react-native';
import {
  Button,
  Card,
  DataTable,
  Dialog,
  Paragraph,
  Portal,
  ProgressBar,
  Text,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import axios from 'axios';
import Constants from 'expo-constants';

import {
  damagesEntity,
  getAllInspections,
  imagesEntity,
  inspectionsEntity,
  selectDamageEntities,
  selectImageEntities,
  selectInspectionEntities,
  selectInspectionIds,
  selectPartEntities,
  selectTaskEntities,
  selectVehicleEntities,
  tasksEntity,
  vehiclesEntity,
} from '@monkvision/corejs';
import { utils } from '@monkvision/toolkit';
import useEmbeddedModel from '@monkvision/camera/src/hooks/useEmbeddedModel';

import { INSPECTION_READ, PROFILE } from 'screens/names';
import MonkIcon from 'components/Icons/MonkIcon';
import InspectionButton from 'screens/Landing/InspectionButton';
import useIndexedDb from 'hooks/useLoadModel';

// TODO: Replace/Delete once the model will be available on the bucket

const { spacing } = utils.styles;
const LIMIT = 25;

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  id: {
    fontFamily: 'monospace',
  },
  card: {
    borderTopStartRadius: 0,
  },
  cardContent: {
    paddingTop: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  cardActions: {
    justifyContent: 'flex-start',
  },
  button: {
    marginLeft: spacing(2),
  },
  statusDot: {
    width: 12,
    maxWidth: 12,
    height: 12,
    borderRadius: 999,
    marginHorizontal: spacing(1),
  },
  statusLayout: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    maxWidth: 75,
  },
  dateLayout: {
    display: 'flex',
    alignItems: 'center',
    width: 47,
  },
  rowOdd: {
    backgroundColor: '#f6f6f6',
  },
  headerRight: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollListContainer: {
    height: Platform.select({
      native: '100%',
      default: '100vh',
    }),
  },
  scrollList: {
    paddingBottom: 132,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    top: 150,
  },
});

export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const canRenderStatus = width > 480;

  const handleSignOut = useCallback(
    () => navigation.navigate(PROFILE),
    [navigation],
  );

  const scrollListRef = useRef();
  const url = Constants.manifest.extra.MODEL_TFLITE_URL;

  const { refresh } = useRequest(getAllInspections({
    params: {
      limit: LIMIT,
      show_deleted: false,
    },
  }));

  const [showLoadModelDialog, setShowLoadModelDialog] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const startDb = useIndexedDb();
  const em = useEmbeddedModel();

  const ids = useSelector(selectInspectionIds);
  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const damagesEntities = useSelector(selectDamageEntities);
  const partsEntities = useSelector(selectPartEntities);
  const tasksEntities = useSelector(selectTaskEntities);
  const vehiclesEntities = useSelector(selectVehicleEntities);
  const auth = useSelector((state) => state.auth);

  const { inspections: doneInspections } = denormalize({ inspections: ids }, {
    inspections: [inspectionsEntity],
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

  const handlePress = useCallback(
    (inspectionId) => {
      navigation.navigate(INSPECTION_READ, { inspectionId });
    },
    [navigation],
  );

  const downloadModel = useCallback((config = {}) => axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${auth.accessToken}`,
    },
    ...config,
  }), [auth.accessToken, url]);

  const handleDownloadModel = useCallback(async () => {
    setShowLoadModelDialog(true);
    if (Platform.OS === 'web') {
      const config = {
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = (progressEvent.loaded / progressEvent.total);
          setDownloadProgress(percentCompleted);
        },
      };
      const rawData = await downloadModel(config);
      await startDb(rawData.data, 'imageQualityCheck');
    } else if (em && typeof em.downloadThenSaveModelNative === 'function') {
      em.constants.MODELS.forEach(async (name, index) => {
        await em.downloadThenSaveModelNative(name, em.constants.MODEL_URIS[index]);
      });
    }
    console.log('Model saved');
    setShowLoadModelDialog(false);
  }, [downloadModel, em, startDb]);

  const isUpdated = useMemo(async () => {
    const rawData = new Uint8Array(await downloadModel().data);
    const storedData = new Uint8Array(await startDb());

    return (rawData.length === storedData.length
      && rawData.every((value, index) => value === storedData[index]));
  }, [downloadModel, startDb]);

  useLayoutEffect(() => {
    isUpdated.then((res) => {
      if (navigation) {
        navigation?.setOptions({
          title: 'Home',
          headerTitle: () => (
            <MonkIcon
              width={135}
              height={34}
              color={colors.primary}
              style={styles.logo}
              alt="Monk logo"
            />
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <Button
                onPress={handleDownloadModel}
                accessibilityLabel="Account"
                disabled={res}
                color="#FFC300"
                mode={res ? 'text' : 'contained'}
              >
                {res ? 'Model is up-to-date' : 'Model need to be updated'}
              </Button>
              <Button
                onPress={handleSignOut}
                icon="account"
                accessibilityLabel="Account"
              >
                Account
              </Button>
            </View>
          ),
        });
      }
    });
  }, [colors.primary, handleDownloadModel, handleSignOut, isUpdated, navigation]);

  const renderItem = useCallback(({ item: { id, createdAt, vehicle }, index }) => (
    <DataTable.Row
      key={`inspectionRow-${id}`}
      onPress={() => handlePress(id)}
      style={[styles.row, Math.abs(index % 2) === 1 && styles.rowOdd]}
    >
      <DataTable.Cell>
        {vehicle?.brand}
        {` `}
        {vehicle?.model}
      </DataTable.Cell>
      <DataTable.Cell style={styles.dateLayout}>
        {moment(createdAt).format('ll')}
      </DataTable.Cell>
      <DataTable.Cell style={styles.statusLayout}>
        {canRenderStatus ? <Text style={{ height: 12 }}>Done</Text> : null}
        <View>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
        </View>
      </DataTable.Cell>
    </DataTable.Row>
  ), [canRenderStatus, colors.success, handlePress]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      if (startDb) {
        startDb(null)
          .then((res) => setShowLoadModelDialog(Object.keys(res).length === 0));
      }
    }
  }, [em, startDb]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      if (em && typeof em.isModelInStorage === 'function') {
        const models = em.constants.MODELS;
        setShowLoadModelDialog(models.filter(em.isModelInStorage).length !== models.length);
      }
    }
  }, [em]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <Portal>
        <Dialog visible={showLoadModelDialog} onDismiss={() => setShowLoadModelDialog(false)}>
          <Dialog.Title>Download model</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Download and save models on device</Paragraph>
            {downloadProgress > 0 && <ProgressBar progress={downloadProgress} />}
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="contained" onPress={handleDownloadModel}>Download</Button>
            <Button mode="outlined" onPress={() => setShowLoadModelDialog(false)}>Use API</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <DataTable>
            <VirtualizedList
              ref={scrollListRef}
              style={styles.scrollListContainer}
              contentContainerStyle={styles.scrollList}
              refreshControl={(<RefreshControl onRefresh={refresh} />)}
              scrollEventThrottle={0}
              ListHeaderComponent={(
                <DataTable.Header>
                  <DataTable.Title>Vehicle</DataTable.Title>
                  <DataTable.Title style={styles.dateLayout}>Datetime</DataTable.Title>
                  <DataTable.Title style={styles.statusLayout}>Status</DataTable.Title>
                </DataTable.Header>
                )}
              data={doneInspections}
              initialNumToRender={LIMIT}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              getItemCount={(d) => d?.length}
              getItem={(items, index) => items[index]}
            />
          </DataTable>
        </Card.Content>
        <InspectionButton />
      </Card>
    </SafeAreaView>
  );
};
