import React, { useCallback, useMemo } from 'react';
import { Chip } from 'react-native-paper';
import { Platform, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import iconsDictionary from './icons';

const styles = StyleSheet.create({
  vehicleTypeLayout: {
    marginBottom: 12,
    marginLeft: 12,
  },
  vehicleTypeChip: {
    margin: 2,
    marginBottom: 4,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 33,
  },
  noscrollLayout: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    marginLeft: 12,
  },
  layout: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      native: {
        paddingTop: 6,
      },
    }),
  },
  text: {
    marginRight: 6,
  },
});

export default function VehicleType({ selected, onSelect, loading, locallySelected, colors }) {
  const { t } = useTranslation();

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
    <View contentContainerStyle={styles.vehicleTypeLayout} style={styles.noscrollLayout}>
      {Object.keys(icons).map((key) => (
        <Chip
          key={key}
          selected={key === selected}
          onPress={() => onSelect(key)}
          style={[styles.vehicleTypeChip, { backgroundColor: composeColor(key), paddingHorizontal: key === selected ? 0 : 11 }]}
          mode="outlined"
          disabled={loading}
        >
          <View style={styles.layout}>
            <Text style={[styles.text, { color: colors.text }]}>
              {t(icons[key].name)}
            </Text>
            {icons[key].icon}
          </View>
        </Chip>
      ))}
    </View>
  );
}

VehicleType.propTypes = {
  colors: PropTypes.shape({
    disabled: PropTypes.string,
    onSurface: PropTypes.string,
    surface: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  locallySelected: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.string,
};

VehicleType.defaultProps = {
  onSelect: () => {},
  locallySelected: null,
  selected: null,
};
