import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Divider, IconButton } from 'react-native-paper';

import useToggle from 'hooks/useToggle';

export default function ActionsMenu({ menuItems }) {
  const [isMenuOpen, handleOpenMenu, handleDismissMenu] = useToggle();
  return React.useMemo(() => (
    <Menu
      anchor={<IconButton icon="menu" onPress={handleOpenMenu} />}
      visible={isMenuOpen}
      onDismiss={handleDismissMenu}
    >
      { menuItems.map((item, index) => !item.divider && (
        <Menu.Item
          key={String(index)}
          title={item.title}
          titleStyle={item.titleStyle}
          loading={item.loading}
          onPress={() => handleDismissMenu(item.onPress)}
          disabled={item.disabled}
        />
      )) }
      <Divider />
      { menuItems.map((item, index) => item.divider && (
        <Menu.Item
          key={String(index)}
          title={item.title}
          titleStyle={item.titleStyle}
          loading={item.loading}
          onPress={() => handleDismissMenu(item.onPress)}
          disabled={item.disabled}
        />
      )) }
    </Menu>
  ), [handleDismissMenu, handleOpenMenu, isMenuOpen, menuItems]);
}

ActionsMenu.propTypes = {
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    disabled: PropTypes.bool,
    divider: PropTypes.bool,
    loading: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    titleStyle: PropTypes.shape,
  })).isRequired,
};
