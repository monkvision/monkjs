import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

export default function FullScreenButton() {
  const { t } = useTranslation();

  return (
    <Text
      style={{
        color: '#FFF',
        display: 'flex',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 10,
        textTransform: 'uppercase',
      }}
    >
      {t('controls.fullScreen')}
    </Text>
  );
}
