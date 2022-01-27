import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { BottomSheet } from '@monkvision/react-native-views';

import { spacing } from 'config/theme';
import texts from './text';

const styles = StyleSheet.create({
  content: {
    marginVertical: spacing(2),
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    margin: spacing(1),
    width: 200,
  },
  li: {
    marginTop: spacing(2),
  },
});

export default function VinGuide({ isOpen, handleClose }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <BottomSheet.Title title="Where to find the VIN?" />
      <BottomSheet.Content style={styles.content}>
        <Text>VIN can usually be found:</Text>
        {texts.map((text) => (
          <Text key={text} style={styles.li}>
            👉
            {' '}
            {text}
          </Text>
        ))}
      </BottomSheet.Content>
      <BottomSheet.Actions style={styles.actions}>
        <Button
          onPress={handleClose}
          mode="contained"
          style={[styles.button, { alignSelf: 'center' }]}
        >
          Got it
        </Button>
      </BottomSheet.Actions>
    </BottomSheet>
  );
}

VinGuide.propTypes = {
  handleClose: PropTypes.func,
  isOpen: PropTypes.bool,
};

VinGuide.defaultProps = {
  handleClose: noop,
  isOpen: false,
};
