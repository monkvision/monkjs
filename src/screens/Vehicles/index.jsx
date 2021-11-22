import React, { useCallback, useState, useEffect, useLayoutEffect } from 'react';
import moment from 'moment';

import { getAllVehicles, selectAllVehicles } from '@monkvision/corejs';
import { useFakeActivity } from '@monkvision/react-native-views';
import { useNavigation } from '@react-navigation/native';

import { View, ScrollView, SafeAreaView, StyleSheet, Platform, Dimensions } from 'react-native';
import { Appbar, Searchbar, Button, Card, IconButton, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import useFilter from 'hooks/useFilter/index';
import { VEHICLE_READ } from 'screens/names';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  listView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
  },
  card: {
    margin: 8,
    display: 'flex',
    flexGrow: 1,
    minWidth: 304,
    cursor: 'pointer',
    ...Platform.select({
      native: { maxWidth: Dimensions.get('window').width - 16 },
      default: { maxWidth: 'calc(100% - 16px)' },
    }),
  },
});

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { loading, error, paging } = useSelector(({ vehicles }) => vehicles);
  const vehicles = useSelector(selectAllVehicles);

  const [fakeActivity] = useFakeActivity(loading === 'pending');

  const [searchQuery, setSearchQuery] = useState('');

  // eslint-disable-next-line no-console
  console.log('vehicles', vehicles);

  const filteredVehicles = useFilter(['vin', 'brand'], searchQuery, vehicles ?? []);

  const handleRefresh = useCallback(() => {
    dispatch(getAllVehicles());
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('Delete vehicle');
  }, []);

  const handlePress = useCallback((vehicleId) => {
    navigation.navigate(VEHICLE_READ, { vehicleId });
  }, [navigation]);

  const handleGoBack = useCallback(() => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        header: () => (
          <Appbar.Header>
            <Appbar.BackAction onPress={handleGoBack} />
            <Appbar.Content
              title="Vehicles list"
              subtitle="Owned by your organization and you"
            />
            <Button
              icon={fakeActivity ? undefined : 'refresh'}
              onPress={handleRefresh}
              color={colors.primaryContrastText}
              loading={fakeActivity}
              disabled={fakeActivity}
            >
              Refresh
            </Button>
          </Appbar.Header>
        ),
      });
    }
  }, [fakeActivity, handleGoBack, handleRefresh, navigation, colors]);

  useEffect(() => {
    if (!fakeActivity && !paging && !error) {
      handleRefresh();
    }
  }, [error, fakeActivity, handleRefresh, paging]);

  return (
    <SafeAreaView>
      <Searchbar
        placeholder="Filter by vehicle VIN"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <ScrollView>
        <View style={styles.listView}>
          { filteredVehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              style={styles.card}
              onPress={() => handlePress(vehicle.id)}
            >
              <Card.Title
                title={vehicle.vin}
                subtitle={`${moment(vehicle.createdAt).format('L')} - ${vehicle.id.split('-')[0]}...`}
                right={() => (
                  <IconButton icon="trash-can" color={colors.warning} onPress={handleDelete} />
                )}
                left={() => (
                  <IconButton icon="car" color={colors.primary} />
                )}
              />
            </Card>
          )) }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
