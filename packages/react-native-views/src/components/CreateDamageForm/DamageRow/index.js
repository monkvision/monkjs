import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, DataTable } from 'react-native-paper';
import { startCase, noop } from 'lodash';
import { useMediaQuery } from 'react-responsive';

import Select from '../../Select';

const styles = StyleSheet.create({
  cell: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    paddingTop: 5,
    flexGrow: 1,
  },
  rightSide: { justifyContent: 'flex-end', maxHeight: 50 },
  title: { maxWidth: 100 },
});

export default function DamageRow({
  value,
  title,
  selectedValue,
  data,
  onPress,
  onChange,
  disabled,
}) {
  const isMobile = useMediaQuery({ query: '(max-device-width: 350px)' });

  const handleValueWidth = useMemo(() => {
    const MAX_POSSIBLE_LENGTH = isMobile ? 25 : Infinity;
    if (value?.length > MAX_POSSIBLE_LENGTH) {
      return `${startCase(value?.substring(0, 20))}...`;
    }
    return startCase(value);
  }, [value, isMobile]);

  return (
    <DataTable.Row onPress={onPress}>
      <DataTable.Cell style={styles.title}>{title}</DataTable.Cell>
      <DataTable.Cell style={styles.rightSide}>
        <Select
          disabled={disabled}
          onChange={(e) => onChange(e)}
          onOpen={onPress}
          data={data}
          selectedValue={selectedValue}
          label={(item) => startCase(item)}
          itemKey={(item) => item}
          anchor={() => (
            <View style={styles.cell}>
              <Text>{handleValueWidth || 'Not given'}</Text>
              <IconButton icon="pencil" disabled />
            </View>
          )}
        />
      </DataTable.Cell>
    </DataTable.Row>
  );
}
DamageRow.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onPress: PropTypes.func,
  selectedValue: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,
};
DamageRow.defaultProps = {
  data: [],
  disabled: false,
  onChange: noop,
  onPress: noop,
  value: null,
  title: null,
  selectedValue: null,
};
