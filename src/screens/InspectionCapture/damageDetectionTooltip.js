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

const DamageDetectionTooltip = forwardRef(({ onFinish, onContinue }, ref) => {
  const { colors } = useTheme();
  return (
    <Modal ref={ref}>
      <Card.Title title="Would you like to inspect the vehicle interior?" />
      <Card.Content>
        <Paragraph style={{ color: colors.text }}>
          If you skip this step, you wont be able to inspect the car from inside after going back
          tho the inspection page
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
};
DamageDetectionTooltip.defaultProps = {
  onContinue: () => {},
  onFinish: () => {},
};

export default DamageDetectionTooltip;
