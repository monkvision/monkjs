import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, DataTable } from 'react-native-paper';
import { startCase } from 'lodash';
import { useMediaQuery } from 'react-responsive';

const styles = StyleSheet.create({
  cell: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingTop: 5,
    flexGrow: 1,
  },
  alignLeft: { justifyContent: 'flex-end' },
  title: { maxWidth: 100 },
});

// width < 350 ? MAX_POSSIBLE_LENGTH : Infinity

export default function DamageRow({ value, title, ...rest }) {
  const isMobile = useMediaQuery({ query: '(max-device-width: 350px)' });

  const handleValueWidth = useMemo(() => {
    const MAX_POSSIBLE_LENGTH = isMobile ? 25 : Infinity;
    if (value?.length > MAX_POSSIBLE_LENGTH) {
      return `${startCase(value?.substring(0, 20))}...`;
    }
    return startCase(value);
  }, [value, isMobile]);

  return (
    <DataTable.Row {...rest}>
      <DataTable.Cell style={styles.title}>{title}</DataTable.Cell>
      <DataTable.Cell style={styles.alignLeft}>
        <View style={styles.cell}>
          <Text>{handleValueWidth || 'Not given'}</Text>
          <IconButton icon="pencil" disabled />
        </View>
      </DataTable.Cell>
    </DataTable.Row>
  );
}
DamageRow.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
};
DamageRow.defaultProps = {
  value: null,
  title: null,
};
