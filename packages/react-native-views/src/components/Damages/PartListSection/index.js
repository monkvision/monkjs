import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import startCase from 'lodash.startcase';
import noop from 'lodash.noop';

import { List } from 'react-native-paper';
import { deleteOneDamage } from '@monkvision/corejs';

import DamageListItem from '../DamageListItem';
import DeleteDamageDialog from '../DeleteDialog';

export default function PartListSection({
  id: partId,
  partType,
  damages,
  isValidated,
  onSelectDamage,
  onDeleteDamage,
  isDeleting,
}) {
  const [deleteDamage, setDeleteDamage] = useState({});

  const handleDismissDialog = useCallback(() => setDeleteDamage({}), []);

  const handleDeleteDamage = useCallback(() => {
    onDeleteDamage(
      deleteOneDamage({ id: deleteDamage.id, inspectionId: deleteDamage.inspectionId }),
    );
  }, [deleteDamage.id, deleteDamage.inspectionId, onDeleteDamage]);

  const handleSelectDamage = useCallback((damage) => {
    onSelectDamage({
      id: damage.id,
      inspectionId: damage.inspectionId,
      partId,
    });
  }, [onSelectDamage, partId]);

  if (!damages) { return null; }
  return (
    <>
      <List.Section>
        <List.Subheader>{startCase(partType)}</List.Subheader>
        {damages.map((damage) => (
          <DamageListItem
            isValidated={isValidated}
            key={`damage-${damage.id}`}
            onSelect={() => handleSelectDamage(damage)}
            onDelete={() => setDeleteDamage(damage)}
            {...damage}
          />
        ))}
      </List.Section>
      <DeleteDamageDialog
        isDialogOpen={!!deleteDamage.id}
        handleDismissDialog={handleDismissDialog}
        isDeleting={isDeleting}
        handleDelete={handleDeleteDamage}
      />
    </>
  );
}

PartListSection.propTypes = {
  damages: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
  isDeleting: PropTypes.bool,
  isValidated: PropTypes.bool.isRequired,
  onDeleteDamage: PropTypes.func,
  onSelectDamage: PropTypes.func,
  partType: PropTypes.string.isRequired,
};

PartListSection.defaultProps = {
  isDeleting: false,
  onDeleteDamage: noop,
  onSelectDamage: noop,
};
