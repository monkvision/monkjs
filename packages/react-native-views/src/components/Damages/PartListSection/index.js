import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import startCase from 'lodash.startcase';
import noop from 'lodash.noop';
import { Platform, StyleSheet } from 'react-native';

import { Card, Chip, DataTable } from 'react-native-paper';
import { spacing } from '../../../theme';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing(2),
    marginBottom: spacing(2),
  },
  cardContent: {
    paddingTop: 0,
    paddingHorizontal: 0,
    margin: 0,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  row: {
    backgroundColor: '#fafafa',
  },
  rowOdd: {
    backgroundColor: '#f6f6f6',
  },
  flexEnd: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chip: {
    ...Platform.OS === 'web' ? { cursor: 'default' } : {},
  },
});

export default function PartListSection({
  id: partId,
  partType,
  damages,
  onSelectDamage,
}) {
  const handleSelectDamage = useCallback((damage) => {
    onSelectDamage({
      id: damage.id,
      inspectionId: damage.inspectionId,
      partId,
    });
  }, [onSelectDamage, partId]);

  if (!damages) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Title
        title={startCase(partType)}
        subtitle={`${damages.length} damage${damages.length > 1 ? 's' : ''} detected`}
      />
      <Card.Content style={styles.cardContent}>
        <DataTable>
          {damages.map((damage, i) => (
            <DataTable.Row
              key={`damage-${damage.id}`}
              onPress={() => handleSelectDamage(damage)}
              style={Math.abs(i % 2) === 1 ? styles.rowOdd : styles.row}
            >
              <DataTable.Cell>
                {startCase(damage.damageType)}
              </DataTable.Cell>
              <DataTable.Cell style={styles.flexEnd}>
                <Chip
                  style={styles.chip}
                  icon={damage.createdBy === 'algo' ? 'matrix' : 'account'}
                >
                  {damage.createdBy === 'algo' ? 'AI' : 'Human'}
                </Chip>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card.Content>
    </Card>
  );
}

PartListSection.propTypes = {
  damages: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
  onSelectDamage: PropTypes.func,
  partType: PropTypes.string.isRequired,
};

PartListSection.defaultProps = {
  onSelectDamage: noop,
};
