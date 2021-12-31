import React from 'react';
import PropTypes from 'prop-types';

import { Button, Portal, Modal } from 'react-native-paper';
import { startCase } from 'lodash';
import { Picker } from '@react-native-picker/picker';
import { View } from 'react-native';

import styles from '../styles';

function DamagePicker({ visible, selectedValue, onValueChange, data, onClose }) {
  return (
    <Portal>
      <Modal visible={visible} style={styles.pickerLayout}>
        <View style={styles.picker}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
          >
            {data?.map(
              (item) => <Picker.Item label={startCase(item)} key={item} value={item} />,
            )}
          </Picker>
          <Button onPress={onClose} style={styles.button} mode="outlined">
            Cancel
          </Button>
        </View>
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
