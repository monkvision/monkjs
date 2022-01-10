/* eslint-disable react/prop-types */
import { noop } from 'lodash';
import React, { forwardRef, useImperativeHandle } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu } from 'react-native-paper';

import useToggle from '../../hooks/useToggle';

const styles = StyleSheet.create({
  menuContent: {
    height: 220,
  },
});

function Select({
  selectedValue = '',
  data = ['Not given'],
  onChange = noop,
  label = (item) => item,
  anchor = () => <></>,
  itemKey = (item) => item,
  onOpen = noop,
  disabled = false,
  contentStyle = {},
}, ref) {
  const [isOpen, handleOpen, handleDismiss] = useToggle();

  useImperativeHandle(ref, () => ({
    focus: handleOpen,
    blur: handleDismiss,
  }));

  return (
    <Menu
      contentStyle={styles.menuContent}
      visible={isOpen}
      onDismiss={handleDismiss}
      anchor={(
        <TouchableOpacity
          disabled={disabled}
          onPress={() => { handleOpen(); onOpen(); }}
          style={contentStyle}
        >
          {anchor(() => {
            if (!disabled) { handleOpen(); }
          })}
        </TouchableOpacity>
)}
    >
      <ScrollView>
        {data?.length ? data.map((item) => (
          <Menu.Item
            style={{ backgroundColor: selectedValue === label(item) ? '#F2F2F2' : 'transparent' }}
            onPress={() => { handleDismiss(); onChange(item); }}
            key={itemKey(item)}
            title={label(item)}
          />
        )) : null}
      </ScrollView>
    </Menu>
  );
}

export default forwardRef(Select);
