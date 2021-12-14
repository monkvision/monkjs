import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { DataTable, Button, useTheme, Text, Card, IconButton } from 'react-native-paper';

import { getAllInspections, inspectionStatuses } from '@monkvision/corejs';
import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';

import useAuth from 'hooks/useAuth';
import useRequest from 'hooks/useRequest/index';
import MonkIcon from 'components/Icons/MonkIcon';
import { GETTING_STARTED, INSPECTIONS, INSPECTION_READ } from 'screens/names';
import { spacing } from 'config/theme';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  id: { fontFamily: 'monospace' },
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
    minHeight: 180,
  },
  button: {
    margin: spacing(1),
    width: 200,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: spacing(3),
    marginTop: spacing(5),
  },
});
export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { signOut } = useAuth();

  const handleSignOut = useCallback(signOut, [signOut]);
  const handleStart = useCallback(() => navigation.navigate(GETTING_STARTED), [navigation]);
  const handleList = useCallback(() => navigation.navigate(INSPECTIONS), [navigation]);

  const {
    response: doneResponse,
    isLoading: doneLoading,
    refresh: refreshDoneInspections,
  } = useRequest(getAllInspections({
    params: {
      inspection_status: inspectionStatuses.IN_PROGRESS,
      limit: 3,
    },
  }));
  const [fakeDoneLoading] = useFakeActivity(doneLoading);

  const {
    response: inProgressResponse,
    isLoading: inProgressLoading,
    refresh: refreshInProgressInspections,
  } = useRequest(getAllInspections({
    params: {
      inspection_status: inspectionStatuses.DONE,
      limit: 3,
    },
  }));
  const [fakeInProgressLoading] = useFakeActivity(inProgressLoading);

  const doneInspections = useMemo(() => {
    const inspections = doneResponse?.entities?.inspections;
    if (!inspections) { return null; }
    return Object.keys(inspections).map((key) => inspections[key]);
  }, [doneResponse.entities]);

  const inProgressInspections = useMemo(() => {
    const inspections = inProgressResponse?.entities?.inspections;
    if (!inspections) { return null; }
    return Object.keys(inspections).map((key) => inspections[key]);
  }, [inProgressResponse.entities]);

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
          <Button onPress={handleSignOut} accessibilityLabel="Sign out">
            Sign out
          </Button>
        ),
      });
    }
  }, [colors, handleSignOut, navigation]);

  return (

    <SafeAreaView style={styles.root}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Title
            title="Latest done inspections"
            subtitle={doneInspections?.length && `Here are your ${doneInspections.length} last done inspections`}
            right={() => (<IconButton onPress={refreshDoneInspections} icon="refresh" color={colors.primary} disabled={fakeDoneLoading} />)}
          />
          <Card.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title># Key</DataTable.Title>
                <DataTable.Title>Vehicle</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Status</DataTable.Title>
              </DataTable.Header>

              {fakeDoneLoading ? <ActivityIndicatorView light /> : null}
              {doneInspections?.length
          && doneInspections.map(({ id, createdAt, vehicle }) => (
            <DataTable.Row key={`inspectionRow-${id}`} onPress={() => handlePress(id)}>
              <DataTable.Cell><Text style={styles.id}>{id.split('-')[0]}</Text></DataTable.Cell>
              <DataTable.Cell>
                {vehicle?.brand}
                {` `}
                {vehicle?.model}
              </DataTable.Cell>
              <DataTable.Cell>{moment(createdAt).format('lll')}</DataTable.Cell>
              <DataTable.Cell>Done</DataTable.Cell>
            </DataTable.Row>
          ))}
            </DataTable>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="In progress inspections"
            subtitle={inProgressInspections?.length && `Here are your ${inProgressInspections.length} last in progress inspections`}
            right={() => (<IconButton onPress={refreshInProgressInspections} icon="refresh" color={colors.primary} disabled={fakeInProgressLoading} />)}
          />
          <Card.Content>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title># Key</DataTable.Title>
                <DataTable.Title>Vehicle</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Status</DataTable.Title>
              </DataTable.Header>

              {inProgressLoading ? <ActivityIndicatorView light /> : null}
              {inProgressInspections?.length
          && inProgressInspections.map(({ id, createdAt, vehicle }) => (
            <DataTable.Row key={`inspectionRow-${id}`} onPress={() => handlePress(id)}>
              <DataTable.Cell><Text style={styles.id}>{id.split('-')[0]}</Text></DataTable.Cell>
              <DataTable.Cell>
                {vehicle?.brand}
                {` `}
                {vehicle?.model}
              </DataTable.Cell>
              <DataTable.Cell>{moment(createdAt).format('lll')}</DataTable.Cell>
              <DataTable.Cell>In progress</DataTable.Cell>
            </DataTable.Row>
          ))}
            </DataTable>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button onPress={handleStart} mode="contained" style={styles.button} icon="file-edit-outline">
              New inspection
            </Button>
            <Button
              onPress={handleList}
              mode="outlined"
              style={[styles.button, { borderColor: colors.primary }]}
              icon="folder-search-outline"
            >
              All inspections
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};
