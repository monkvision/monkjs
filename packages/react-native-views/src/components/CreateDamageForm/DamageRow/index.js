import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { IconButton, DataTable } from 'react-native-paper';
import { startCase } from 'lodash';
import styles from '../styles';

export default function DamageRow({ value, title, ...rest }) {
  return (
    <DataTable.Row {...rest}>
      <DataTable.Cell>{title}</DataTable.Cell>
      <DataTable.Cell style={styles.alignLeft}>
        <View style={styles.cell}>
          <Text>{startCase(value) || 'Not given'}</Text>
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
