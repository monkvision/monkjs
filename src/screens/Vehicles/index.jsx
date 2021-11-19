import React, { useCallback } from 'react';
import { Button, Searchbar, List, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView, View } from 'react-native';

import { getAllInspections, selectAllInspections } from '@monkvision/corejs';

import useFilter from 'hooks/useFilter/index';
import { VEHICLE_UPDATE } from 'screens/names';

import vehicles from './vehicles';

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();

  const inspections = useSelector(selectAllInspections);
  const [searchQuery, setSearchQuery] = React.useState('');

  // eslint-disable-next-line no-console
  console.log(inspections);

  const filteredVehicles = useFilter(['vin', 'brand'], searchQuery, vehicles ?? []);

  const getAll = useCallback(() => {
    dispatch(getAllInspections());
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
