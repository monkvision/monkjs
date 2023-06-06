import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Button, Menu } from 'react-native-paper';
import { useMonitoring } from '@monkvision/corejs';

export const ASYNC_STORAGE_LANG_KEY = '@lang_Storage';

export default function LanguageSwitch() {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const { errorHandler } = useMonitoring();
  const { i18n } = useTranslation();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const setLanguage = (lng) => {
    setIsLoading(true);
    closeMenu();
    i18n.changeLanguage(lng)
      .then(() => AsyncStorage.setItem(ASYNC_STORAGE_LANG_KEY, lng))
      .then(() => setIsLoading(false))
      .catch((err) => {
        setIsLoading(false);
        errorHandler(err);
      });
  };

  const getButtonContent = useCallback(() => {
    if (isLoading) {
      return <ActivityIndicator animating />;
    }
    const en = '🇬🇧 ▼';
    const fr = '🇫🇷 ▼';
    const de = '🇩🇪 ▼';
    if (!i18n.language) {
      setLanguage('en');
      return en;
    }

    if (i18n.language.startsWith('de')) {
      return de;
    }
    if (i18n.language.startsWith('fr')) {
      return fr;
    }

    return en;
  }, [isLoading, i18n.language]);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<Button color="white" onPress={openMenu} disabled={isLoading}>{getButtonContent()}</Button>}
    >
      <Menu.Item onPress={() => setLanguage('en')} title="🇬🇧 English" />
      <Menu.Item onPress={() => setLanguage('de')} title="🇩🇪 German" />
      <Menu.Item onPress={() => setLanguage('fr')} title="🇫🇷 Français" />
    </Menu>
  );
}
