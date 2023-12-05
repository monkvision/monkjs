import { theme as initialTheme } from '@monkvision/toolkit';
import { DefaultTheme } from 'react-native-paper';
import Clients from '../clients';

import defaultPalette from './default';
import catPalette from './cat';

const ClientPalettes = {
  [Clients.DEFAULT]: defaultPalette,
  [Clients.CAT]: catPalette,
  [Clients.FASTBACK]: defaultPalette,
  [Clients.ALPHA]: defaultPalette,
  [Clients.ALGODRIVEN_CAPTURE]: defaultPalette,
  [Clients.ALGODRIVEN_REPORT]: defaultPalette,
  [Clients.VIDEO_POC]: defaultPalette,
};

export default function getClientTheme(client) {
  const palette = ClientPalettes[client] ?? ClientPalettes[Clients.DEFAULT];

  return {
    ...DefaultTheme,
    ...initialTheme,
    dark: true,
    mode: 'adaptive',
    loaderDotsColors: [
      palette['color-primary-400'],
      palette['color-primary-300'],
      palette['color-primary-200'],
      palette['color-primary-100'],
    ],
    colors: {
      primary: palette['color-primary-500'],
      success: palette['color-success-500'],
      accent: palette['color-info-400'],
      info: palette['color-info-500'],
      warning: palette['color-warning-500'],
      danger: palette['color-danger-500'],
      gradient: palette['color-primary-900'],
      background: palette['color-background'],
      surface: palette['color-surface'],
      onSurface: palette['color-onSurface'],
      text: palette['color-text'],
      placeholder: palette['color-placeholder'],
      disabled: palette['color-disabled'],
      notification: palette['color-notification'],
    },
    palette,
  };
}
