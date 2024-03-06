const { MonkApiPermission, MonkNetworkError } = jest.requireActual('@monkvision/network');

const MonkApi = {
  getInspection: jest.fn(() => Promise.resolve()),
  addImage: jest.fn(() => Promise.resolve()),
  updateTaskStatus: jest.fn(() => Promise.resolve()),
  startInspectionTasks: jest.fn(() => Promise.resolve()),
};

export = {
  /* Actual exports */
  MonkApiPermission,
  MonkNetworkError,

  /* Mocks */
  decodeMonkJwt: jest.fn((str) => str),
  MonkApi,
  useMonkApi: jest.fn(() => MonkApi),
};
