import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { Modal, Card, Button, Portal, withTheme } from 'react-native-paper';
import { startCase, noop } from 'lodash';

import { utils } from '@monkvision/react-native';

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

function ComplianceModal({ theme, complianceIssues, onDismiss, ...props }) {
  const { colors } = theme;
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
                Issues in this image:
              </Text>
              {complianceIssues.map((item) => (
                <Text key={item}>
                  -
                  {' '}
                  {startCase(item)}
                </Text>
              ))}
            </View>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button onPress={onDismiss} mode="contained" color={colors.primary} style={styles.button}>got it</Button>
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
export default withTheme(ComplianceModal);
