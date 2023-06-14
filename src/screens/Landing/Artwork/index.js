import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { Title } from 'react-native-paper';
import { useClient } from '../../../contexts';

import Svg from './svg';
import styles from './styles';

export default function Artwork() {
  const { t } = useTranslation();
  const { theme, info } = useClient();

  return (
    <View style={styles.root}>
      <Svg palette={theme.palette} />
      <Title style={styles.title}>{t('landing.logoDescription')}</Title>
      <Image
        alt={`Logo of ${info.companyName}`}
        style={{ width: info.logo.width, height: info.logo.height, resizeMode: 'contain' }}
        {...info.logo}
      />
    </View>
  );
}
