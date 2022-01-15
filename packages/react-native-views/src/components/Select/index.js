/* eslint-disable react/prop-types */
import { noop } from 'lodash';
import React, { forwardRef, useImperativeHandle, useCallback } from 'react';
import { Platform, StyleSheet, TouchableOpacity, VirtualizedList } from 'react-native';
import { Menu } from 'react-native-paper';

import useToggle from '../../hooks/useToggle';
import useTimeout from '../../hooks/useTimeout';

const MENU_ANIMATION_DELAY = 180;

const styles = StyleSheet.create({
  menuContent: {
    height: 220,
    width: 240,
    paddingVertical: 0,
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
  const [isOpenAfterDelay, handleOpenAfterDelay, handleDismissAfterDelay] = useToggle();

  /**
   * Due to the fact that we don't need Web menu animation; whenever the state "isOpen"
   * has become true, we will update "isOpenAfterDelay" to be also true but after the
   * animation delay and in the same way when it became false.
   */

  const delay = isOpen ? MENU_ANIMATION_DELAY : null;
  useTimeout(handleOpenAfterDelay, delay);

  useImperativeHandle(ref, () => ({
    focus: handleOpen,
    blur: handleDismiss,
  }));

  const onDismiss = useCallback(() => {
    handleDismiss();
    handleDismissAfterDelay();
  }, [handleDismiss, handleDismissAfterDelay]);

  const isWebAndShouldWaitForTheDelay = Platform.OS === 'web' && (!isOpenAfterDelay || !isOpen);

  return (
    <Menu
      contentStyle={styles.menuContent}
      visible={isOpen}
      onDismiss={onDismiss}
      style={{ opacity: isWebAndShouldWaitForTheDelay ? 0 : 1 }}
      anchor={(
        <TouchableOpacity
          disabled={disabled}
          onPress={() => { handleOpen(); onOpen(); }}
          style={contentStyle}
        >
          {anchor(() => {
            if (!disabled) { handleOpen(); onOpen(); }
          })}
        </TouchableOpacity>
    )}
    >
      <VirtualizedList
        data={data}
        initialNumToRender={5}
        renderItem={({ item }) => (
          <Menu.Item
            style={{ backgroundColor: selectedValue === label(item) ? '#F2F2F2' : 'transparent' }}
            onPress={() => { handleDismiss(); onChange(item); }}
            title={label(item)}
          />
        )}
        keyExtractor={(item) => itemKey(item)}
        getItemCount={(d) => d?.length}
        getItem={(items, index) => label(items[index])}
      />
    </Menu>
  );
}

export default forwardRef(Select);
