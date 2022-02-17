import React from 'react';
import PropTypes from 'prop-types';

import { Button, Portal, Modal, Card } from 'react-native-paper';
import { startCase } from 'lodash';
import { Picker } from '@react-native-picker/picker';

import { utils } from '@monkvision/toolkit';
import { Platform, StyleSheet } from 'react-native';

const spacing = utils.styles.spacing;
const styles = StyleSheet.create({
  button: { margin: spacing(1), alignSelf: 'center', flex: 1 },
  pickerModal: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' },
  pickerLayout: {
    backgroundColor: '#FFF',
    minWidth: 280,
    width: '100%',
  },
  picker: {
    ...Platform.select({
      web: {
        height: 40,
        borderRadius: 4,
        borderColor: '#b9b9b9',
        backgroundColor: '#FFF',
      },
    }),
  },
});

function DamagePicker({ visible, selectedValue, onValueChange, data, onClose }) {
  return (
    <Portal>
      <Modal visible={visible} style={styles.pickerModal} onDismiss={onClose}>
        <Card style={styles.pickerLayout}>
          <Card.Title title="Select" subtitle="Please select one item" />
          <Card.Content>
            <Picker
              selectedValue={selectedValue}
              onValueChange={onValueChange}
              style={styles.picker}
            >
              {data?.map((item) => <Picker.Item label={startCase(item)} key={item} value={item} />)}
            </Picker>
          </Card.Content>
          <Card.Actions>
            <Button onPress={onClose} style={styles.button} mode="outlined">
              Cancel
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}

DamagePicker.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  onClose: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  selectedValue: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
};
export default DamagePicker;
