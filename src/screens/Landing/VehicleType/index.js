import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Chip } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  vehicleTypeLayout: {
    marginBottom: 12,
    marginLeft: 12,
  },
  vehicleTypeChip: {
    marginRight: 12,
  },
});

const VEHICLE_TYPES = [
  {
    name: 'Full-Size SUV',
    icon: '',
  },
  {
    name: 'Crossover SUV',
    icon: '',
  },
  {
    name: 'Mid-Size Car',
    icon: '',
  },
  {
    name: 'Compact Car',
    icon: 'car-hatchback',
  },
  {
    name: 'Full-Size Van',
    icon: 'van-utility',
  },
  {
    name: 'Minivan',
    icon: '',
  },
  {
    name: 'Pickup',
    icon: 'car-pickup',
  },
];

export default function VehicleType({ selected, onSelect, colors }) {
  return (
    <ScrollView contentContainerStyle={styles.vehicleTypeLayout} horizontal>
      {VEHICLE_TYPES.map((item) => (
        <Chip
          key={item.name}
          selected={selected === item.name}
          onPress={() => onSelect(item.name)}
          style={[
            styles.vehicleTypeChip,
            { backgroundColor: selected === item.name
              ? colors.onSurface : colors.surface },
          ]}
          mode="outlined"
          icon={item.icon || 'car-hatchback'}
        >
          {item.name}
        </Chip>
      ))}
    </ScrollView>
  );
}

VehicleType.propTypes = {
  colors: PropTypes.shape({
    onSurface: PropTypes.string,
    surface: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func,
  selected: PropTypes.string,
};

VehicleType.defaultProps = {
  onSelect: () => {},
  selected: null,
};
