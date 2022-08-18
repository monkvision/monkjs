import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme, Menu, List } from 'react-native-paper';
import PropTypes from 'prop-types';

import styles from './styles';

const Modal = forwardRef(({ onSelect, title, items, children }, ref) => {
  const { colors } = useTheme();
  const [modal, setModal] = useState(false);

  const close = () => setModal(false);
  const open = () => setModal(true);

  useImperativeHandle(ref, () => ({ open, close }));

  if (!modal) { return null; }

  if (children) {
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <View style={[styles.playground, { backgroundColor: colors.background }]}>
            {children }
          </View>
          <Pressable
            style={[styles.pressOutside, { backgroundColor: colors.surface }]}
            onPress={close}
          />
        </View>
      </View>
    );
  }
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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string, value: PropTypes.string,
    }),
  ),
  onSelect: PropTypes.func,
  title: PropTypes.string,
};

Modal.defaultProps = {
  children: null,
  items: [],
  onSelect: () => {},
  title: '',

};
export default Modal;
