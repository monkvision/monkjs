import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import startCase from 'lodash.startcase';
import noop from 'lodash.noop';

import { List } from 'react-native-paper';

import DamageListItem from '../DamageListItem';
import DeleteDamageDialog from '../DeleteDialog';

export default function PartListSection({
  id: partId,
  partType,
  damages,
  isValidated,
  onSelectDamage,
  onDeleteDamage,
  isLoading,
}) {
  const [deleteDamage, setDeleteDamage] = useState({});

  const handleDismissDialog = useCallback(() => {
    setDeleteDamage({});
  }, []);

  const handleDelete = useCallback(() => {
    onDeleteDamage({
      id: deleteDamage.id,
      inspectionId: deleteDamage.inspectionId,
    }, handleDismissDialog);
  }, [deleteDamage.id, deleteDamage.inspectionId, handleDismissDialog, onDeleteDamage]);

  const handleSelectDamage = useCallback((damage) => {
    onSelectDamage({
      id: damage.id,
      inspectionId: damage.inspectionId,
      partId,
    });
  }, [onSelectDamage, partId]);

  const handleDeleteDamage = useCallback(() => {
    handleDelete();
  }, [handleDelete]);

  return damages && (
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
        isDialogOpen={deleteDamage.id}
        handleDismissDialog={handleDismissDialog}
        isLoading={isLoading}
        handleDelete={handleDeleteDamage}
      />
    </>
  );
}

PartListSection.propTypes = {
  damages: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  isValidated: PropTypes.bool.isRequired,
  onDeleteDamage: PropTypes.func,
  onSelectDamage: PropTypes.func,
  partType: PropTypes.string.isRequired,
};

PartListSection.defaultProps = {
  isLoading: false,
  onDeleteDamage: noop,
  onSelectDamage: noop,
};
