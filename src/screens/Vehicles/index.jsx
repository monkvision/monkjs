import React, { useCallback, useState } from 'react';
import { Button, Searchbar, List, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView, View } from 'react-native';

import { getAllVehicles, selectAllVehicles } from '@monkvision/corejs/src';

import useFilter from 'hooks/useFilter/index';
import { VEHICLE_UPDATE } from 'screens/names';

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();

  const vehicles = useSelector(selectAllVehicles);

  const [searchQuery, setSearchQuery] = useState('');

  // eslint-disable-next-line no-console
  console.log('vehicles', vehicles);

  const filteredVehicles = useFilter(['vin', 'brand'], searchQuery, vehicles ?? []);

  const getAll = useCallback(() => {
    dispatch(getAllVehicles());
  }, [dispatch]);

  const handleVehicleUpdate = useCallback(() => {
    navigation.navigate(VEHICLE_UPDATE);
  }, [navigation]);

  return (
    <View>
      <Searchbar
        placeholder="Filter by vehicle VIN"
        onChangeText={setSearchQuery}
        value={searchQuery}
        theme={theme}
      />
      <Button onPress={getAll}>Get All</Button>
      <ScrollView>
        { filteredVehicles.map((vehicle) => (
          <List.Item
            key={vehicle.id}
            title={vehicle.vin}
            description={vehicle.brand}
            onPress={handleVehicleUpdate}
            left={(props) => <List.Icon {...props} icon="car" />}
            right={(props) => <List.Icon {...props} icon="open" />}
            theme={theme}
          />
        )) }

      </ScrollView>
    </View>
  );
};
