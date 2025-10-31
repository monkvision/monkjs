const { MonkApiPermission, MonkNetworkError, ImageUploadType } =
  jest.requireActual('@monkvision/network');

const MonkApi = {
  getInspection: jest.fn(() => Promise.resolve()),
  getAllInspections: jest.fn(() => Promise.resolve()),
  getAllInspectionsCount: jest.fn(() => Promise.resolve()),
  createInspection: jest.fn(() => Promise.resolve()),
  addImage: jest.fn(() => Promise.resolve()),
  updateTaskStatus: jest.fn(() => Promise.resolve()),
  startInspectionTasks: jest.fn(() => Promise.resolve()),
  getLiveConfig: jest.fn(() => Promise.resolve({})),
  updateInspectionVehicle: jest.fn(() => Promise.resolve()),
  updateAdditionalData: jest.fn(() => Promise.resolve()),
  createPricing: jest.fn(() => Promise.resolve()),
  deletePricing: jest.fn(() => Promise.resolve()),
  updatePricing: jest.fn(() => Promise.resolve()),
  createDamage: jest.fn(() => Promise.resolve()),
  deleteDamage: jest.fn(() => Promise.resolve()),
  uploadPdf: jest.fn(() => Promise.resolve()),
  getPdf: jest.fn(() => Promise.resolve()),
};

export = {
  /* Actual exports */
  MonkApiPermission,
  MonkNetworkError,
  ImageUploadType,

  /* Mocks */
  decodeMonkJwt: jest.fn((str) => str),
  isUserAuthorized: jest.fn(() => true),
  isTokenExpired: jest.fn(() => false),
  isTokenValid: jest.fn(() => true),
  getApiConfigOrThrow: jest.fn(),
  useAuth: jest.fn(() => ({
    authToken: null,
    login: jest.fn(() => Promise.resolve('')),
    logout: jest.fn(() => Promise.resolve()),
  })),
  MonkApi,
  useMonkApi: jest.fn(() => MonkApi),
  useInspectionPoll: jest.fn(),
};
