import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { BottomSheet } from '@monkvision/react-native-views';

import { spacing } from 'config/theme';
import Drawing from 'components/Drawing/index';
import texts from './text';
import vinLocations from '../assets/vinLocations.svg';
import vinFormat from '../assets/vinFormat.svg';

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
    justifyContent: 'flex-start',
    flexDirection: 'row',
    width: '100%',
  },
  liText: {
    flexShrink: 1,
  },
  smallTitle: {
    fontWeight: '500',
    fontSize: 16,
  },
  drawing: {
    marginVertical: spacing(1),
    width: '100%',
    alignItems: 'center',
  },
});

export default function VinGuide({ isOpen, onClose }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <BottomSheet.Title title="Where to find the VIN?" />
      <BottomSheet.Content style={styles.content}>
        <View style={styles.drawing}>
          <Drawing xml={vinFormat} width={180} />
        </View>
        <View style={styles.drawing}>
          <Drawing xml={vinLocations} height={200} />
        </View>
        <Text style={styles.smallTitle}>VIN can usually be found:</Text>
        {texts.map((text) => (
          <View key={text} style={styles.li}>
            <Text>
              👉
              {' '}
            </Text>
            <Text style={styles.liText}>
              {text}
            </Text>
          </View>
        ))}
      </BottomSheet.Content>
      <BottomSheet.Actions style={styles.actions}>
        <Button
          onPress={onClose}
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
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

VinGuide.defaultProps = {
  isOpen: false,
  onClose: noop,
};
