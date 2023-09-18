import React from 'react';
import { useI18nLink } from '@monkvision/common';
import { i18nCamera } from '@monkvision/camera-web';
import { useTranslation } from 'react-i18next';
import { CameraView } from './CameraView';

export function App() {
  const { i18n } = useTranslation();
  useI18nLink(i18n, [i18nCamera]);

  return <CameraView />;
}
