import React, { useCallback, useState } from 'react';
import Proptypes from 'prop-types';

import { Button, Dialog, Paragraph, Portal, useTheme } from 'react-native-paper';
import styles from '../styles';

export default function UploadFailureDialog({ isVisible }) {
  const { colors } = useTheme();
  const [isDismissed, setDismissed] = useState(false);
  const handleDismiss = useCallback(() => setDismissed(true), []);

  return (
    <Portal>
      <Dialog
        visible={isVisible && !isDismissed}
        onDismiss={() => handleDismiss()}
        style={styles.dialog}
      >
        <Dialog.Title style={styles.dialogContent}>
          Upload has failed
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.dialogContent}>
            You can continue to take pictures and retry later via importation.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button
            onPress={() => handleDismiss()}
            labelStyle={{ color: 'white' }}
            style={styles.button}
            mode="contained"
            color={colors.primary}
          >
            Continue
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

UploadFailureDialog.propTypes = {
  isVisible: Proptypes.bool,
};

UploadFailureDialog.defaultProps = {
  isVisible: false,
};
