import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Button, Card, Paragraph, useTheme } from 'react-native-paper';

import Modal from 'components/Modal';

const styles = StyleSheet.create({
  actions: {
    marginVertical: 8,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leftButton: {
    marginRight: 8,
  },
});

const getModeTarget = (selectedMode) => (selectedMode === 'car360' ? 'interior' : 'exterior');

const DamageDetectionTooltip = forwardRef(({ onFinish, onContinue, selectedMode }, ref) => {
  const { colors } = useTheme();
  return (
    <Modal ref={ref}>
      <Card.Title title={`Would you like to inspect the car from ${getModeTarget(selectedMode)}?`} />
      <Card.Content>
        <Paragraph style={{ color: colors.text }}>
          If you press FINISH DAMAGE DETECTION,
          both exterior and interior modes will be inaccessible
        </Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          style={[{ backgroundColor: colors.text }, styles.leftButton]}
          color={colors.background}
          onPress={onContinue}
        >
          Proceed to interior
        </Button>
        <Button mode="text" onPress={onFinish}>Finish damage detection</Button>
      </Card.Actions>
    </Modal>
  );
});

DamageDetectionTooltip.propTypes = {
  onContinue: PropTypes.func,
  onFinish: PropTypes.func,
  selectedMode: PropTypes.string,
};
DamageDetectionTooltip.defaultProps = {
  onContinue: () => {},
  onFinish: () => {},
  selectedMode: '',
};

export default DamageDetectionTooltip;
