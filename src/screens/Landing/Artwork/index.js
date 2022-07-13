import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import ExpoConstants from 'expo-constants';
import { Title } from 'react-native-paper';

import Svg from './svg';
import styles from './styles';

export default function Artwork() {
  const { t } = useTranslation();
  const { theme, logo, companyName } = ExpoConstants.manifest.extra;

  return (
    <View style={styles.root}>
      <Svg palette={theme.palette} />
      <Title style={styles.title}>{t('landing.logoDescription')}</Title>
      <Image
        alt={`Logo of ${companyName}`}
        style={{ width: logo.width, height: logo.height, resizeMode: 'contain' }}
        {...logo}
      />
    </View>
  );
}
