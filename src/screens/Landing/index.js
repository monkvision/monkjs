import useRequest from 'hooks/useRequest';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, VirtualizedList, RefreshControl, View, useWindowDimensions, Platform } from 'react-native';
import { DataTable, Button, useTheme, Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

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
import { utils } from '@monkvision/toolkit';

import { PROFILE, INSPECTION_READ, INSPECTION_WHEEL_ANALYSIS } from 'screens/names';
import MonkIcon from 'components/Icons/MonkIcon';
import InspectionButton from 'screens/Landing/InspectionButton';

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

  const { refresh } = useRequest(getAllInspections({
    params: {
      limit: LIMIT,
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
      // navigation.navigate(INSPECTION_WHEEL_ANALYSIS, { inspectionId, wheelAnalysisId: '3fa85f64-5717-4562-b3fc-2c963f66afa2' });
    },
    [navigation],
  );

  useLayoutEffect(() => {
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
  }, [colors.primary, handleSignOut, navigation]);

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

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
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
