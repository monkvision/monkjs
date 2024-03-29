const i18nextInstanceMock: any = {
  language: 'en',
  changeLanguage: jest.fn(() => Promise.resolve(undefined)),
  on: jest.fn(),
  use: jest.fn(() => i18nextInstanceMock),
  init: jest.fn(() => Promise.resolve(undefined)),
};

export = {
  /* Actual exports */

  /* Mocks */
  createInstance: jest.fn(() => i18nextInstanceMock),
};
