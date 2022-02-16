import React from 'react';
import PropTypes from 'prop-types';

import { Button, useTheme } from 'react-native-paper';

import CustomDialog from '../../CustomDialog';
import styles from '../styles';

export default function DeleteDamageDialog({
  isDialogOpen,
  handleDismissDialog,
  handleDelete,
  isDeleting,
}) {
  const { colors } = useTheme();

  return (
    <CustomDialog
      isOpen={isDialogOpen}
      handDismiss={handleDismissDialog}
      title="Confirm damage deletion"
      content="Are you sure that you really really want to DELETE this damage ?"
      actions={(
        <>
          <Button
            color={colors.error}
            style={styles.button}
            onPress={handleDelete}
            mode="contained"
            icon={isDeleting ? undefined : 'trash-can'}
            labelStyle={{ color: 'white' }}
            loading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
          <Button onPress={handleDismissDialog} style={styles.button} mode="outlined">
            Cancel
          </Button>
        </>
      )}
    />
  );
}

DeleteDamageDialog.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleDismissDialog: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
};
