import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash.startcase';
import { useNavigation } from '@react-navigation/native';
import useRequest from 'hooks/useRequest';

import { List } from 'react-native-paper';
import DamageListItem from 'screens/Damages/DamageListItem';
import DeleteDamageDialog from 'screens/Damages/DeleteDialog';
import { DAMAGE_READ } from 'screens/names';

import { deleteOneDamage } from '@monkvision/corejs';

export default function PartListSection({ id: partId, partType, damages, isValidated }) {
  const navigation = useNavigation();
  const [deleteDamage, setDeleteDamage] = useState({});

  const handleDismissDialog = useCallback(() => {
    setDeleteDamage({});
  }, []);

  // we need error handling here
  const { isLoading: isDeleteLoading, request: handleDelete } = useRequest(
    deleteOneDamage({ id: deleteDamage.id, inspectionId: deleteDamage.inspectionId }),
    { onSuccess: handleDismissDialog },
    false,
  );

  const handleSelectDamage = useCallback((damage) => {
    navigation.navigate(DAMAGE_READ, {
      id: damage.id,
      inspectionId: damage.inspectionId,
      partId,
    });
  }, [navigation, partId]);

  const handleDeleteDamage = useCallback(() => {
    handleDelete();
  }, [handleDelete]);

  return damages && (
    <>
      <List.Section>
        <List.Subheader>{startCase(partType)}</List.Subheader>
        {damages.map((damage) => (
          <DamageListItem isValidated={isValidated} key={`damage-${damage.id}`} onSelect={() => handleSelectDamage(damage)} onDelete={() => setDeleteDamage(damage)} {...damage} />
        ))}
      </List.Section>
      <DeleteDamageDialog
        isDialogOpen={deleteDamage.id}
        handleDismissDialog={handleDismissDialog}
        isLoading={isDeleteLoading}
        handleDelete={handleDeleteDamage}
      />
    </>
  );
}

PartListSection.propTypes = {
  damages: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
  isValidated: PropTypes.bool.isRequired,
  partType: PropTypes.string.isRequired,
};
