import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Portal, Dialog, Paragraph } from 'react-native-paper';

const styles = StyleSheet.create({
  dialog: {
    maxWidth: 450,
    alignSelf: 'center',
    padding: 3,
  },
  dialogContent: { textAlign: 'center' },
  dialogActions: { flexWrap: 'wrap' },
});

export default function CustomDialog({
  isOpen, handDismiss, title, content, actions, children, illustration,
}) {
  return (
    <Portal>
      <Dialog
        visible={Boolean(isOpen)}
        onDismiss={handDismiss}
        style={styles.dialog}
      >
        {illustration}

        {title ? (
          <Dialog.Title style={styles.dialogContent}>
            {title}
          </Dialog.Title>
        ) : null}

        {content ? (
          <Dialog.Content>
            <Paragraph style={styles.dialogContent}>
              {content}
            </Paragraph>
          </Dialog.Content>
        ) : null}

        {children}

        {actions ? (
          <Dialog.Actions style={styles.dialogActions}>
            { actions}
          </Dialog.Actions>
        ) : null}
      </Dialog>
    </Portal>
  );
}

CustomDialog.propTypes = {
  actions: PropTypes.element,
  children: PropTypes.element,
  content: PropTypes.string,
  handDismiss: PropTypes.func.isRequired,
  illustration: PropTypes.element,
  isOpen: PropTypes.bool,
  title: PropTypes.string,
};

CustomDialog.defaultProps = {
  actions: null,
  children: null,
  content: undefined,
  illustration: null,
  isOpen: false,
  title: undefined,
};
