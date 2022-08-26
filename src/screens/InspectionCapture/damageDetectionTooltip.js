import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform } from 'react-native';
import { Button, Card, Paragraph, useTheme } from 'react-native-paper';

import Modal from 'components/Modal';

const styles = StyleSheet.create({
  actions: {
    marginVertical: 8,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  leftButton: {
    marginRight: 8,
  },
  title: {
    width: '100%',
    ...(Platform.OS === 'web' ? { whiteSpace: 'initial' } : {}),
  },
});

const getCurrentMode = (selectedMode) => (selectedMode !== 'car360'
  ? { title: 'interior', p: 'inside' } : { title: 'exterior', p: 'outside' });

const getModeTarget = (selectedMode) => (selectedMode === 'car360'
  ? { title: 'interior', p: 'inside' } : { title: 'exterior', p: 'outside' });

const DamageDetectionTooltip = forwardRef(({ onFinish, onContinue, selectedMode }, ref) => {
  const { colors } = useTheme();
  return (
    <Modal ref={ref}>
      <Card.Title titleStyle={styles.title} title={`Would you like to inspect the vehicle ${getModeTarget(selectedMode).title} now?`} />
      <Card.Content>
        <Paragraph style={{ color: colors.text }}>
          {`If you skip this step, you will not be able to inspect the ${getModeTarget(selectedMode).p} of the vehicle from the homepage later on`}
        </Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          style={[{ backgroundColor: colors.text }, styles.leftButton]}
          color={colors.background}
          onPress={onContinue}
        >
          {`Proceed to ${getModeTarget(selectedMode).title}`}
        </Button>
        <Button mode="text" onPress={onFinish}>{`Add other photos of the ${getCurrentMode(selectedMode).title}`}</Button>
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
