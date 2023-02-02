import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

export default function TakePictureButton() {
  const { t } = useTranslation();

  return (
    <Text
      style={{
        display: 'flex',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 12,
        textTransform: 'uppercase',
      }}
    >
      {t('controls.takePicture')}
    </Text>
  );
}
