import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import isEmpty from 'lodash.isempty';
import moment from 'moment';
import { denormalize } from 'normalizr';

import {
  damagesEntity,
  getAllInspections,
  selectDamageEntities,
  selectInspectionEntities,
  selectInspectionIds,
  selectImageEntities,
  selectPartEntities,
  selectTaskEntities,
  selectVehicleEntities,
  imagesEntity,
  inspectionsEntity,
  tasksEntity,
  vehiclesEntity,
} from '@monkvision/corejs';

import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';
import { useNavigation } from '@react-navigation/native';
import useRequest from 'hooks/useRequest';

import { Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import Drawing from 'components/Drawing';
import { DataTable, Button, Text, useTheme } from 'react-native-paper';

import { INSPECTION_READ } from 'screens/names';

import errorDrawing from './assets/error.svg';
import emptyDrawing from './assets/emptyDocument.svg';

const LIMIT_OPTIONS = [10, 20, 30, 100];

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  errorLayout: {
    ...Platform.select({ native: { flex: 1 },
      default: { display: 'flex', flexGrow: 1, minHeight: 'calc(100vh - 64px)' },
    }),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContent: { textAlign: 'center', margin: 12 },
  id: { fontFamily: 'monospace' },
});

export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(LIMIT_OPTIONS[1]);

  const { error, isLoading, refresh } = useRequest(getAllInspections({
    params: {
      limit: itemsPerPage,
      show_deleted: false,
    },
  }));

  const ids = useSelector(selectInspectionIds);
  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const damagesEntities = useSelector(selectDamageEntities);
  const partsEntities = useSelector(selectPartEntities);
  const tasksEntities = useSelector(selectTaskEntities);
  const vehiclesEntities = useSelector(selectVehicleEntities);

  const { inspections } = denormalize({ inspections: ids }, {
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

  const [fakeActivity] = useFakeActivity(isLoading);

  const handlePress = useCallback(
    (inspectionId) => {
      navigation.navigate(INSPECTION_READ, { inspectionId });
    },
    [navigation],
  );

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Inspections list',
        headerBackVisible: true,
        headerRight: () => (
          <Button
            icon={fakeActivity ? undefined : 'refresh'}
            onPress={refresh}
            loading={fakeActivity}
            disabled={fakeActivity}
          >
            Refresh
          </Button>
        ),
      });
    }
  }, [colors, fakeActivity, refresh, navigation]);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  // error
  if (error && !inspections?.length) {
    return (
      <View style={styles.errorLayout}>
        <Drawing xml={errorDrawing} height="200" />
        <Text style={styles.errorContent}>
          Something went wrong, we
          {'\''}
          re investigating...
        </Text>
      </View>
    );
  }

  // no data yet
  if (!error && !isLoading && !inspections?.length) {
    return (
      <View style={styles.errorLayout}>
        <Drawing xml={emptyDrawing} height="200" />
        <Text style={styles.errorContent}>
          It seems like you have no data yet, once you submit an inspections, it will be shown here.
        </Text>
      </View>
    );
  }

  // loading
  if (isLoading) {
    return <ActivityIndicatorView light />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title># Key</DataTable.Title>
            <DataTable.Title>Vehicle</DataTable.Title>
            <DataTable.Title>Date</DataTable.Title>
            <DataTable.Title>Tasks</DataTable.Title>
          </DataTable.Header>

          {inspections.map(({ id, createdAt, images, vehicle }) => !isEmpty(images) && (
          <DataTable.Row key={`inspectionRow-${id}`} onPress={() => handlePress(id)}>
            <DataTable.Cell><Text style={styles.id}>{id.split('-')[0]}</Text></DataTable.Cell>
            <DataTable.Cell>
              {vehicle?.brand}
              {` `}
              {vehicle?.model}
            </DataTable.Cell>
            <DataTable.Cell>{moment(createdAt).format('lll')}</DataTable.Cell>
            <DataTable.Cell />
          </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            onPageChange={(p) => setPage(p)}
            optionsPerPage={LIMIT_OPTIONS}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            showFastPagination
            optionsLabel="Rows per page"
          />
        </DataTable>
      </ScrollView>
    </SafeAreaView>
  );
};
