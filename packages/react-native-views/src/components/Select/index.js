import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { Menu } from 'react-native-paper';

import useToggle from '../../hooks/useToggle';

const styles = StyleSheet.create({
  menuContent: {
    height: 220,
  },
});

function Select({
  selectedValue,
  data,
  onChange,
  label,
  anchor,
  itemKey,
  onOpen,
  disabled,
  contentStyle,
}) {
  const [isOpen, handleOpen, handleDismiss] = useToggle();

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

Select.propTypes = {
  anchor: PropTypes.func,
  contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  data: PropTypes.arrayOf(PropTypes.any),
  disabled: PropTypes.bool,
  itemKey: PropTypes.func,
  label: PropTypes.func,
  onChange: PropTypes.func,
  onOpen: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  selectedValue: PropTypes.any,
};

Select.defaultProps = {
  anchor: () => <></>,
  contentStyle: {},
  data: ['Not given'],
  disabled: false,
  itemKey: (item) => item,
  label: (item) => item,
  onChange: noop,
  onOpen: noop,
  selectedValue: '',
};

export default Select;
