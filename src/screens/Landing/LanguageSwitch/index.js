import { useSentry } from '@monkvision/toolkit';
import { SentryConstants } from '@monkvision/toolkit/src/hooks/useSentry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sentry from 'config/sentry';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Button, Menu } from 'react-native-paper';

export const ASYNC_STORAGE_LANG_KEY = '@lang_Storage';

export default function LanguageSwitch() {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const { errorHandler } = useSentry(Sentry);
  const { i18n } = useTranslation();

  const openMenu = useCallback(() => setVisible(true), [setVisible]);
  const closeMenu = useCallback(() => setVisible(false), [setVisible]);

  const setLanguage = useCallback((lng) => {
    setIsLoading(true);
    closeMenu();
    i18n.changeLanguage(lng)
      .then(() => AsyncStorage.setItem(ASYNC_STORAGE_LANG_KEY, lng))
      .then(() => setIsLoading(false))
      .catch((err) => {
        setIsLoading(false);
        errorHandler(err, SentryConstants.type.APP);
      });
  }, [setIsLoading, closeMenu, i18n, errorHandler]);

  const getButtonContent = useCallback(() => {
    if (isLoading) {
      return <ActivityIndicator animating />;
    }
    return i18n.language === 'fr' ? '🇫🇷 ▼' : '🇬🇧 ▼';
  }, [isLoading, i18n.language]);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={<Button onPress={openMenu} disabled={isLoading}>{getButtonContent()}</Button>}
    >
      <Menu.Item onPress={() => setLanguage('en')} title="🇬🇧 English" />
      <Menu.Item onPress={() => setLanguage('fr')} title="🇫🇷 Français" />
    </Menu>
  );
}
