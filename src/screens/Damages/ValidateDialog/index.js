import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import CustomDialog from 'components/CustomDialog';
import Drawing from 'components/Drawing/index';

import { useRoute } from '@react-navigation/native';
import useRequest from 'hooks/useRequest';

import submitDrawing from 'assets/submit.svg';
import styles from 'screens/Damages/styles';

import {
  taskStatuses,
  updateOneTaskOfInspection,
  taskNames,
} from '@monkvision/corejs';

export default function ValidateDialog({ isDialogOpen, handleDismissDialog }) {
  const route = useRoute();
  const { inspectionId } = route.params;

  // we need error handling here
  const { isLoading, request } = useRequest(
    updateOneTaskOfInspection({
      inspectionId,
      taskName: taskNames.DAMAGE_DETECTION,
      data: { status: taskStatuses.VALIDATED },
    }),
    { onSuccess: handleDismissDialog },
    false,
  );

  return (
    <CustomDialog
      isOpen={Boolean(isDialogOpen)}
      handleDismiss={handleDismissDialog}
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
            onPress={request}
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
  isDialogOpen: PropTypes.bool.isRequired,
};
