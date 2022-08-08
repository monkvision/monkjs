import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { Button, Menu } from 'react-native-paper';

export default function ConnectionModeSwitch({ initialMode, onModeSwitch }) {
  if (initialMode === 'offline' && Platform.OS === 'web') {
    throw new Error('Trying to set connection mode to offline in web.');
  }

  const [visible, setVisible] = React.useState(false);
  const [currentMode, setCurrentMode] = React.useState(initialMode);
  const { t } = useTranslation();

  const openMenu = useCallback(() => setVisible(true), [setVisible]);
  const closeMenu = useCallback(() => setVisible(false), [setVisible]);

  const setConnectionModeSwitch = useCallback((mode) => {
    closeMenu();
    setCurrentMode(mode);
    onModeSwitch(mode);
  }, [closeMenu, setCurrentMode, onModeSwitch]);

  const getButtonContent = useCallback(
    () => `${t(`landing.connectionMode.${currentMode}`)} ▼`,
    [t, currentMode],
  );

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={(
        <Button color="#ffffff" onPress={openMenu}>
          {getButtonContent()}
        </Button>
      )}
    >
      <Menu.Item
        onPress={() => setConnectionModeSwitch('online')}
        title={t('landing.connectionMode.online')}
      />
      <Menu.Item
        onPress={() => setConnectionModeSwitch('semi-offline')}
        title={t('landing.connectionMode.semi-offline')}
      />
      {Platform.OS === 'web' ? null : (
        <Menu.Item
          onPress={() => setConnectionModeSwitch('offline')}
          title={t('landing.connectionMode.offline')}
        />
      )}
    </Menu>
  );
}

ConnectionModeSwitch.propTypes = {
  initialMode: PropTypes.string,
  onModeSwitch: PropTypes.func.isRequired,
};

ConnectionModeSwitch.defaultProps = {
  initialMode: 'online',
};
