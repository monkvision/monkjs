import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import startCase from 'lodash.startcase';
import noop from 'lodash.noop';

import { List, Chip } from 'react-native-paper';

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
    <List.Accordion
      title={startCase(partType)}
      description={`${damages.length} damage${damages.length > 1 ? 's' : ''} detected`}
    >
      {damages.map((damage) => (
        <List.Item
          key={`damage-${damage.id}`}
          title={startCase(damage.damageType)}
          onPress={() => handleSelectDamage(damage)}
          right={() => (
            <Chip
              icon={damage.createdBy === 'algo' ? 'matrix' : 'account'}
              onPress={() => handleSelectDamage(damage)}
            >
              {damage.createdBy === 'algo' ? 'AI' : 'HI'}
            </Chip>
          )}
        />
      ))}
    </List.Accordion>
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
