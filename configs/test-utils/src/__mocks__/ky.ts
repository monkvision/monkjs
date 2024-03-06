const i18nextInstanceMock: any = {
  language: 'en',
  changeLanguage: jest.fn(() => Promise.resolve(undefined)),
  on: jest.fn(),
  use: jest.fn(() => i18nextInstanceMock),
  init: jest.fn(() => Promise.resolve(undefined)),
};

function createMockKyRequestFn() {
  return jest.fn(() => {
    const helpers = {
      json: jest.fn(() => Promise.resolve({})),
      blob: jest.fn(() => Promise.resolve(new Blob())),
    };
    const response = Promise.resolve({
      status: 200,
      ...helpers,
    });
    Object.assign(response, helpers);
    return response;
  });
}

export = {
  /* Actual exports */

  /* Mocks */
  get: createMockKyRequestFn(),
  post: createMockKyRequestFn(),
  patch: createMockKyRequestFn(),
};
