import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { Modal, Card, Button, Portal, useTheme } from 'react-native-paper';
import startCase from 'lodash.startcase';
import noop from 'lodash.noop';

import { utils } from '@monkvision/toolkit';

const { spacing } = utils.styles;

const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    maxHeight: 280,
    maxWidth: 400,
  },
  card: {
    margin: spacing(2),
  },
  cardContent: {
    marginVertical: spacing(2),
  },
  cardContentLayout: {
    display: 'flex', flexDirection: 'column',
  },
  firstText: { marginBottom: spacing(1) },
  cardActions: {
    alignItems: 'center',
    display: 'flex',
  },
  button: {
    width: '100%',
  },
});

function ComplianceModal({ complianceIssues, onDismiss, ...props }) {
  const { colors } = useTheme();

  return (
    <Portal>
      <Modal
        onDismiss={onDismiss}
        contentContainerStyle={styles.contentContainer}
        style={styles.modal}
        {...props}
      >
        <Card style={styles.card}>
          <Card.Title title="Picture is not compliant" subtitle="Please try re-take it" />
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardContentLayout}>
              <Text style={styles.firstText}>
                Oops, something isn&#39;t right with the picture.
                Please check if it&#39;s not:
              </Text>
              {complianceIssues.map((item) => (
                <Text key={item}>
                  &#9679;&nbsp;
                  {startCase(item)}
                </Text>
              ))}
            </View>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button
              onPress={onDismiss}
              mode="contained"
              color={colors.primary}
              style={styles.button}
            >
              Got it
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}

ComplianceModal.propTypes = {
  complianceIssues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDismiss: PropTypes.func,
};

ComplianceModal.defaultProps = {
  onDismiss: noop,
};
export default ComplianceModal;
