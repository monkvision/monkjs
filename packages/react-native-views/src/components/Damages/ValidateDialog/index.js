import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { View } from 'react-native';
import { Button } from 'react-native-paper';

import { updateOneTaskOfInspection, taskNames, taskStatuses } from '@monkvision/corejs';

import CustomDialog from '../../CustomDialog';
import Drawing from '../../Drawing';
import submitDrawing from './submit';

import styles from '../styles';

export default function ValidateDialog({
  isDialogOpen,
  isLoading,
  onValidate,
  handleDismissDialog,
  inspectionId,
}) {
  const handeValidate = useCallback(() => onValidate(
    updateOneTaskOfInspection({
      inspectionId,
      taskName: taskNames.DAMAGE_DETECTION,
      data: { status: taskStatuses.VALIDATED },
    }),
  ),
  [inspectionId, onValidate]);

  return (
    <CustomDialog
      isOpen={Boolean(isDialogOpen)}
      handDismiss={handleDismissDialog}
      title="Are you sure?"
      content="Please confirm your damage validation"
      icon={(
        <View style={styles.dialogDrawing}>
          <Drawing xml={submitDrawing} width="200" height="120" />
        </View>
      )}
      actions={(
        <>
          <Button onPress={handleDismissDialog} style={styles.button} mode="outlined">
            Cancel
          </Button>
          <Button
            style={styles.button}
            onPress={handeValidate}
            mode="contained"
            disabled={isLoading}
            labelStyle={{ color: 'white' }}
          >
            Confirm
          </Button>
        </>
      )}
    />
  );
}

ValidateDialog.propTypes = {
  handleDismissDialog: PropTypes.func.isRequired,
  inspectionId: PropTypes.string.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  onValidate: PropTypes.func,

};

ValidateDialog.defaultProps = {
  isLoading: false,
  onValidate: noop,
};
