import React, { useCallback, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import PropTypes from 'prop-types';

import { PROFILE, INSPECTION_READ, INSPECTION_IMPORT, INSPECTION_CREATE } from 'screens/names';
import theme, { spacing } from 'config/theme';
import { StatusBar } from 'expo-status-bar';

import { StyleSheet, SafeAreaView, ScrollView, View, useWindowDimensions } from 'react-native';
import { DataTable, Button, useTheme, Text, Card, Menu } from 'react-native-paper';
import LogoIcon from 'components/Icons/LogoIcon';

import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';
import { useNavigation } from '@react-navigation/native';
import useRequest from 'hooks/useRequest/index';
import useToggle from 'hooks/useToggle/index';
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
  inspectionStatuses,
} from '@monkvision/corejs';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  id: {
    fontFamily: 'monospace',
  },
  card: {
    marginHorizontal: spacing(1),
    marginVertical: spacing(1),
    minHeight: 250,
  },
  cardContent: {
    paddingTop: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  cardActions: {
    justifyContent: 'flex-end',
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
});

function StartInspectionMenu({ goToImport, goToCamera }) {
  const [isMenuOpen, handleOpenMenu, handleDismissMenu] = useToggle();

  return (
    <Menu
      anchor={(
        <Button
          accessibilityLabel="New inspection"
          onPress={handleOpenMenu}
          style={styles.button}
          icon="plus"
        >
          Inspection
        </Button>
      )}
      visible={isMenuOpen}
      onDismiss={handleDismissMenu}
    >
      <Menu.Item
        icon="image"
        title="Import pictures"
        onPress={() => { goToImport(); handleDismissMenu(); }}
      />
      <Menu.Item
        icon="camera"
        title="Take pictures"
        onPress={() => { goToCamera(); handleDismissMenu(); }}
      />
    </Menu>
  );
}

StartInspectionMenu.propTypes = {
  goToCamera: PropTypes.func.isRequired,
  goToImport: PropTypes.func.isRequired,
};

export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const canRenderStatus = width > 480;

  const handleSignOut = useCallback(
    () => navigation.navigate(PROFILE),
    [navigation],
  );

  const handleStart = useCallback(
    () => navigation.navigate(INSPECTION_CREATE),
    [navigation],
  );

  const handleGoToImportInspection = useCallback(
    () => navigation.navigate(INSPECTION_IMPORT),
    [navigation],
  );

  const {
    isLoading: doneLoading,
    refresh: refreshDoneInspections,
  } = useRequest(getAllInspections({
    params: {
      inspection_status: inspectionStatuses.DONE,
      limit: 25,
    },
  }));
  const [fakeDoneLoading] = useFakeActivity(doneLoading);

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
    },
    [navigation],
  );

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Home',
        headerTitle: () => (
          <LogoIcon
            width={44}
            height={44}
            color={colors.primary}
            style={styles.logo}
            alt="Monk logo"
          />
        ),
        headerRight: () => (
          <View style={styles.headerRight}>
            <StartInspectionMenu
              goToImport={handleGoToImportInspection}
              goToCamera={handleStart}
            />
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
  }, [colors.primary, handleGoToImportInspection, handleSignOut, handleStart, navigation]);

  if (fakeDoneLoading) {
    return <ActivityIndicatorView theme={theme} light />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Vehicle</DataTable.Title>
                <DataTable.Title style={styles.dateLayout}>Datetime</DataTable.Title>
                <DataTable.Title style={styles.statusLayout}>Status</DataTable.Title>
              </DataTable.Header>
              {doneInspections.map(({ id, createdAt, vehicle }, i) => (
                <DataTable.Row
                  key={`inspectionRow-${id}`}
                  onPress={() => handlePress(id)}
                  style={[styles.row, Math.abs(i % 2) === 1 && styles.rowOdd]}
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
              ))}
            </DataTable>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button
              style={styles.refreshButton}
              accessibilityLabel="Refresh"
              onPress={refreshDoneInspections}
              icon="refresh"
              color={colors.primary}
              loading={fakeDoneLoading}
              disabled={fakeDoneLoading}
            >
              Refresh
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};
