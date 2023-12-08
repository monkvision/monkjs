export = {
  /* Actual exports */

  /* Mocks */
  initReactI18next: {},
  I18nextProvider: jest.fn(({ children }) => <>{children}</>),
  useTranslation: jest.fn(() => ({ t: jest.fn((str) => str) })),
};
