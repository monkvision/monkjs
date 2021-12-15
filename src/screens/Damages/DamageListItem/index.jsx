import React from 'react';
import PropTypes from 'prop-types';
import { List, IconButton, useTheme } from 'react-native-paper';

export default function DamageListItem({ damageType, createdBy, onSelect, onDelete }) {
  const { colors } = useTheme();

  return (
    <List.Item
      title={damageType}
      onPress={onSelect}
      left={() => <List.Icon color="#000" icon={createdBy === 'algo' ? 'matrix' : 'shape-square-plus'} />}
      right={() => <IconButton icon="trash-can" color={colors.warning} onPress={onDelete} />}
    />
  );
}

DamageListItem.propTypes = {
  createdBy: PropTypes.string.isRequired,
  damageType: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};
