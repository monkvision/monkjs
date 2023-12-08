const { MonkApiPermission } = jest.requireActual('@monkvision/network');

export = {
  /* Actual exports */
  MonkApiPermission,

  /* Mocks */
  decodeMonkJwt: jest.fn((str) => str),
};
