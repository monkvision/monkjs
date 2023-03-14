import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import '@testing-library/jest-native/extend-expect';

jest.mock('expo-camera', () => ({
  isAvailableAsync: () => true,
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: ({ name }) => name,
}));

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (str) => str,
    i18n: {
      changeLanguage: () => Promise.resolve(),
    },
  }),
}));
