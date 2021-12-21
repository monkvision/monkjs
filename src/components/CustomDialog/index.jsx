import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
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
  isOpen, handDismiss, title, content,
  icon, actions, children,
}) {
  return (
    <Portal>
      <Dialog
        visible={Boolean(isOpen)}
        onDismiss={handDismiss}
        style={styles.dialog}
      >
        {title && (
        <Dialog.Title style={styles.dialogContent}>
          {icon && icon}
          {title}
        </Dialog.Title>
        )}
        {content && (
        <Dialog.Content>
          <Paragraph style={styles.dialogContent}>
            {content}
          </Paragraph>
        </Dialog.Content>
        )}

        {children && (<>{ children }</>)}

        { actions && (
          <Dialog.Actions style={styles.dialogActions}>
            { actions}
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
  );
}

CustomDialog.propTypes = {
  actions: PropTypes.element,
  children: PropTypes.element,
  content: PropTypes.string,
  handDismiss: PropTypes.func.isRequired,
  icon: PropTypes.element,
  isOpen: PropTypes.bool,
  title: PropTypes.string,
};

CustomDialog.defaultProps = {
  actions: null,
  children: null,
  content: undefined,
  icon: null,
  isOpen: false,
  title: undefined,
};
