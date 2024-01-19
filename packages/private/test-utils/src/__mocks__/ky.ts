const i18nextInstanceMock: any = {
  language: 'en',
  changeLanguage: jest.fn(() => Promise.resolve(undefined)),
  on: jest.fn(),
  use: jest.fn(() => i18nextInstanceMock),
  init: jest.fn(() => Promise.resolve(undefined)),
};

function createMockKyRequestFn() {
  return jest.fn(() =>
    Promise.resolve({
      status: 200,
      json: jest.fn(() => Promise.resolve({})),
    }),
  );
}

export = {
  /* Actual exports */

  /* Mocks */
  get: createMockKyRequestFn(),
};
