import React, { useCallback, useState } from 'react';
import Proptypes from 'prop-types';

import { Dialog, Paragraph, Portal } from 'react-native-paper';
import styles from '../styles';

export default function UploadFailureDialog({ isVisible }) {
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
          Upload failed
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.dialogContent}>
            Your photo upload failed but you can continue to take photo and retry later
          </Paragraph>
        </Dialog.Content>
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
