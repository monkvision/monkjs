import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme, Menu, List } from 'react-native-paper';
import PropTypes from 'prop-types';

import styles from './styles';

const Modal = forwardRef(({ onSelect, title, items }, ref) => {
  const { colors } = useTheme();
  const [modal, setModal] = useState(false);

  const close = () => setModal(false);
  const open = () => setModal(true);

  useImperativeHandle(ref, () => ({ open, close }));

  if (!modal) { return null; }

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={[styles.playground, { backgroundColor: colors.background }]}>
          <List.Subheader>{title}</List.Subheader>
          {items.map((item) => !item.hidden && (
          <Menu.Item
            onPress={() => { onSelect(item.value); close(); }}
            title={item.title}
            key={item.value}
            style={styles.item}
            {...item}
          />
          ))}
        </View>
        <Pressable
          style={[styles.pressOutside, { backgroundColor: colors.surface }]}
          onPress={close}
        />
      </View>
    </View>
  );
});

Modal.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string, value: PropTypes.string,
    }),
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,

};

export default Modal;
