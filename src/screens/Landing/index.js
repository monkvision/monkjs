import React, { useCallback, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, SafeAreaView, ScrollView, View, useWindowDimensions } from 'react-native';

import { GETTING_STARTED, PROFILE, INSPECTION_READ, INSPECTION_IMPORT } from 'screens/names';
import theme, { spacing } from 'config/theme';

import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import {
  DataTable,
  Button,
  useTheme,
  Text,
  Card,
  IconButton,
  Menu,
} from 'react-native-paper';

import moment from 'moment';
import { getAllInspections, inspectionStatuses } from '@monkvision/corejs';
import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';

import useRequest from 'hooks/useRequest/index';
import useToggle from 'hooks/useToggle/index';

import MonkIcon from 'components/Icons/MonkIcon';

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
    maxWidth: 200,
    justifyContent: 'flex-end',
  },
  dateLayout: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: 200,
    minWidth: 150,
  },
  refreshButton: {
    marginVertical: 0,
  },
  rowOdd: {
    backgroundColor: '#f6f6f6',
  },
});

function StartInspectionMenu({ goToImport, goToCamera }) {
  const [isMenuOpen, handleOpenMenu, handleDismissMenu] = useToggle();

  return (
    <Menu
      anchor={(
        <Button onPress={handleOpenMenu} style={styles.button} icon="plus">
          New inspection
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

  const handleSignOut = useCallback(() => navigation.navigate(PROFILE), [navigation]);
  const handleStart = useCallback(() => navigation.navigate(GETTING_STARTED), [navigation]);
  const handleGoToImportInspection = useCallback(
    () => navigation.navigate(INSPECTION_IMPORT), [navigation],
  );

  const {
    response: doneResponse,
    isLoading: doneLoading,
    refresh: refreshDoneInspections,
  } = useRequest(getAllInspections({
    params: {
      inspection_status: inspectionStatuses.DONE,
      limit: 10,
    },
  }));
  const [fakeDoneLoading] = useFakeActivity(doneLoading);

  const getInspectionsArray = useCallback((response) => {
    const inspections = response?.entities?.inspections;
    if (!inspections) { return null; }
    return Object.keys(inspections).map((key) => inspections[key]);
  }, []);

  const doneInspections = getInspectionsArray(doneResponse);

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
          <MonkIcon
            width={100}
            height={44}
            color={colors.primary}
            style={styles.logo}
            alt="Monk logo"
          />
        ),
        headerRight: () => (
          <IconButton
            onPress={handleSignOut}
            accessibilityLabel="Profile"
            icon="account"
            color={colors.primary}
          />
        ),
      });
    }
  }, [colors, handleSignOut, navigation]);

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
                <DataTable.Title style={styles.statusLayout}>
                  <Button
                    labelStyle={styles.refreshButton}
                    compact
                    onPress={refreshDoneInspections}
                    icon="refresh"
                    color={colors.primary}
                    disabled={fakeDoneLoading}
                  >
                    Refresh
                  </Button>
                </DataTable.Title>
              </DataTable.Header>

              {/* data */}
              {doneInspections?.length && doneInspections.map(({ id, createdAt, vehicle }, i) => (
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
                    {moment(createdAt).format('lll')}
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
            <StartInspectionMenu goToImport={handleGoToImportInspection} goToCamera={handleStart} />
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};
