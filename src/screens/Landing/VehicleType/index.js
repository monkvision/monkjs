import React, { useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Chip } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import iconsDictionary from './icons';

const styles = StyleSheet.create({
  vehicleTypeLayout: {
    marginBottom: 12,
    marginLeft: 12,
  },
  vehicleTypeChip: {
    marginRight: 12,
  },
  layout: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginRight: 6,
  },
});

export default function VehicleType({ selected, onSelect, loading, locallySelected, colors }) {
  const icons = useMemo(
    () => iconsDictionary(colors.text),
    [colors.text],
  );

  const updating = useMemo(
    () => locallySelected !== selected && loading,
    [locallySelected, loading],
  );

  const composeColor = useCallback((key) => {
    if (key === selected) { return colors.onSurface; }
    return colors.surface;
  }, [selected, updating, locallySelected]);

  return (
    <ScrollView contentContainerStyle={styles.vehicleTypeLayout} horizontal>
      {Object.keys(icons).map((key) => (
        <Chip
          key={key}
          selected={key === selected}
          onPress={() => onSelect(key)}
          style={[styles.vehicleTypeChip, { backgroundColor: composeColor(key) }]}
          mode="outlined"
          disabled={loading}
        >
          <View style={styles.layout}>
            <Text style={styles.text}>
              {icons[key].name}
            </Text>
            {icons[key].icon}
          </View>
        </Chip>
      ))}
    </ScrollView>
  );
}

VehicleType.propTypes = {
  colors: PropTypes.shape({
    disabled: PropTypes.string,
    onSurface: PropTypes.string,
    surface: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  loading: PropTypes.string.isRequired,
  locallySelected: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.string,
};

VehicleType.defaultProps = {
  onSelect: () => {},
  locallySelected: null,
  selected: null,
};
