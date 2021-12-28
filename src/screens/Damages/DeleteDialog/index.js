import React from 'react';
import PropTypes from 'prop-types';

import { Button, useTheme } from 'react-native-paper';
import CustomDialog from 'components/CustomDialog';

import styles from 'screens/Damages/styles';

export default function DeleteDamageDialog({
  isDialogOpen,
  handleDismissDialog,
  handleDelete,
  isLoading,
}) {
  const { colors } = useTheme();

  return (
    <CustomDialog
      isOpen={Boolean(isDialogOpen)}
      handleDismiss={handleDismissDialog}
      icon={<Button icon="alert" size={36} color={colors.warning} />}
      title="Confirm damage deletion"
      content="Are you sure that you really really want to DELETE this damage ?"
      actions={(
        <>
          <Button onPress={handleDismissDialog} style={styles.button} mode="outlined">
            Cancel
          </Button>
          <Button
            color={colors.error}
            style={styles.button}
            onPress={handleDelete}
            mode="contained"
            icon={isLoading ? undefined : 'trash-can'}
            labelStyle={{ color: 'white' }}
            loading={isLoading}
            disabled={isLoading}
          >
            Delete
          </Button>
        </>
      )}
    />
  );
}

DeleteDamageDialog.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleDismissDialog: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
