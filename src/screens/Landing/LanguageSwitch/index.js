import { useMonitoring } from '@monkvision/corejs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export const ASYNC_STORAGE_LANG_KEY = '@lang_Storage';

const options = [
  { label: '🇬🇧 English', value: 'en' },
  { label: '🇫🇷 French', value: 'fr' },
  { label: '🇩🇪 German', value: 'de' },
];

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    cursor: 'pointer',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#efefef',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  containerStyle: {
    backgroundColor: '#313240',
    color: '#efefef',
  },
  itemTextStyle: {
    color: '#efefef',
  },
});

export default function LanguageSwitch() {
  const { errorHandler } = useMonitoring();
  const { i18n } = useTranslation();

  const setLanguage = (lng) => {
    i18n.changeLanguage(lng)
      .then(() => AsyncStorage.setItem(ASYNC_STORAGE_LANG_KEY, lng))
      .catch((err) => errorHandler(err));
  };

  return (
    <Dropdown
      style={styles.dropdown}
      selectedTextStyle={styles.selectedTextStyle}
      containerStyle={styles.containerStyle}
      itemTextStyle={styles.itemTextStyle}
      iconStyle={styles.iconStyle}
      activeColor="#424456"
      data={options}
      labelField="label"
      valueField="value"
      placeholder="Change language"
      value={i18n.language}
      onChange={(item) => setLanguage(item.value)}
      backgroundColor="#00000080"
    />
  );
}
