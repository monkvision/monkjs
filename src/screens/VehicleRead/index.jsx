import React, { useState, useCallback, useLayoutEffect } from 'react';
import moment from 'moment';

import { updateOneVehicle, selectVehicleById } from '@monkvision/corejs';
import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Appbar, Button, TextInput, Card, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView, StyleSheet, Platform, Dimensions } from 'react-native';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { VEHICLE_UPDATE } from 'screens/names';

const styles = StyleSheet.create({
  inputGroup: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
  },
  input: {
    margin: 8,
    display: 'flex',
    flexGrow: 1,
    minWidth: 304,
    ...Platform.select({
      native: { maxWidth: Dimensions.get('window').width - 16 },
      default: { maxWidth: 'calc(100% - 16px)', cursor: 'pointer' },
    }),
  },
});

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const store = useStore();
  const { colors } = useTheme();

  const { vehicleId, editable } = route.params;

  const { loading } = useSelector(({ vehicles }) => vehicles);

  const vehicle = selectVehicleById(store.getState(), vehicleId);

  const [fakeActivity] = useFakeActivity(loading === 'pending');

  const [vehicleValues, setVehicleValue] = useState(vehicle ?? {});

  const updateVehicleField = (field, value) => {
    setVehicleValue((oldValue) => ({ ...oldValue, [field]: value }));
  };

  const handleUpdate = useCallback(() => {
    const data = {
      brand: vehicleValues.brand,
      model: vehicleValues.model,
      plate: vehicleValues.plate,
      vin: vehicleValues.vin,
      color: vehicleValues.color,
      exterior_cleanliness: vehicleValues.exterior_cleanliness,
      interior_cleanliness: vehicleValues.interior_cleanliness,
      date_of_circulation: vehicleValues.date_of_circulation,
    };
    if (vehicleValues.mileage && typeof vehicleValues.mileage.value === 'string') {
      data.mileage = {
        value: parseInt(vehicleValues.mileage.value, 10),
        unit: vehicleValues.mileage.unit,
      };
    }
    dispatch(updateOneVehicle({ inspectionId: vehicleId, data }));
  }, [dispatch, vehicleId, vehicleValues]);

  const handleDelete = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('Delete vehicle');
  }, []);

  const handleEdit = useCallback(() => {
    navigation.navigate(VEHICLE_UPDATE, { vehicleId, editable: true });
  }, [navigation, vehicleId]);

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
              title={`Vehicle ${editable ? 'Details edit' : 'Details'}`}
              subtitle={`VIN: ${vehicle?.VIN ?? vehicle?.id}`}
            />
            { editable && (
            <Button
              icon={fakeActivity ? undefined : 'check'}
              onPress={handleUpdate}
              color={colors.primaryContrastText}
              loading={fakeActivity}
              disabled={fakeActivity}
            >
              Update
            </Button>
            )}
          </Appbar.Header>
        ),
      });
    }
  }, [colors, editable, fakeActivity, handleGoBack, handleUpdate, navigation, vehicle]);

  // No need for extra details for vehicle for now
  /*
  const handleRefresh = useCallback(() => {
    dispatch(getOneVehicle({ id: vehicleId }));
  }, [dispatch, vehicleId]);

  useEffect(() => {
    if (!fakeActivity && !error) {
      handleRefresh();
    }
  }, [error, fakeActivity, handleRefresh]);
  */

  return (vehicle && !fakeActivity) ? (
    <SafeAreaView>
      <Card>
        <Card.Title
          title={vehicle.vin}
          subtitle={`Creation date: ${moment(vehicle.createdAt).format('L')} - id: ${vehicle.id}`}
          right={() => (editable ? (
            <IconButton icon="trash-can" color={colors.warning} onPress={handleDelete} />
          ) : (
            <IconButton icon="pencil" color={colors.primary} onPress={handleEdit} />
          ))}
          left={() => (
            <IconButton icon="car" color={colors.primary} />
          )}
        />
        <Card.Content style={styles.inputGroup}>
          <TextInput
            mode="outlined"
            style={styles.input}
            label="Brand"
            value={vehicleValues.brand}
            disabled={!editable}
            onChangeText={(val) => updateVehicleField('brand', val)}
            placeholder="e.g TOYOTA"
          />
          <TextInput
            mode="outlined"
            style={styles.input}
            label="Model"
            value={vehicleValues.model}
            disabled={!editable}
            onChangeText={(val) => updateVehicleField('model', val)}
            placeholder="e.g model"
          />
          <TextInput
            mode="outlined"
            style={styles.input}
            label="Plate"
            value={vehicleValues.plate}
            disabled={!editable}
            onChangeText={(val) => updateVehicleField('plate', val)}
            placeholder="e.g plate"
          />
          <TextInput
            mode="outlined"
            style={styles.input}
            label="Mileage"
            value={vehicleValues.mileage?.value}
            disabled={!editable}
            onChangeText={(val) => updateVehicleField('mileage', {
              unit: vehicleValues.mileage?.unit ?? 'km',
              value: val,
            })}
            placeholder="e.g mileage"
          />
          <TextInput
            mode="outlined"
            style={styles.input}
            label="Vin"
            value={vehicleValues.vin}
            disabled={!editable}
            onChangeText={(val) => updateVehicleField('vin', val)}
            placeholder="e.g vin"
          />
          <TextInput
            mode="outlined"
            style={styles.input}
            label="Color"
            value={vehicleValues.color}
            disabled={!editable}
            onChangeText={(val) => updateVehicleField('color', val)}
            placeholder="e.g white"
          />
          <TextInput
            mode="outlined"
            style={styles.input}
            label="Exterior cleanliness"
            value={vehicleValues.exterior_cleanliness}
            disabled={!editable}
            onChangeText={(val) => updateVehicleField('exterior_cleanliness', val)}
            placeholder="e.g clean"
          />
          <TextInput
            mode="outlined"
            style={styles.input}
            label="Interior cleanliness"
            value={vehicleValues.interior_cleanliness}
            disabled={!editable}
            onChangeText={(val) => updateVehicleField('interior_cleanliness', val)}
            placeholder="e.g dirty"
          />
          <TextInput
            mode="outlined"
            style={styles.input}
            label="Date of circulation"
            value={vehicleValues.date_of_circulation}
            disabled={!editable}
            onChangeText={(val) => updateVehicleField('date_of_circulation', val)}
            placeholder="e.g Date"
          />
        </Card.Content>
      </Card>
    </SafeAreaView>
  ) : <ActivityIndicatorView light />;
};
