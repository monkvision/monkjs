import { i18nCamera } from '@monkvision/camera-web';
import { useI18nLink } from '@monkvision/common';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TestView } from './TestView';

export function App() {
  const { i18n } = useTranslation();
  useI18nLink(i18n, [i18nCamera]);

  return <TestView />;
}
