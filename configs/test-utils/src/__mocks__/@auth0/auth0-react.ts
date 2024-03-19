export = {
  /* Actual exports */
  /* Mocks */
  useAuth0: jest.fn(() => ({
    getAccessTokenWithPopup: jest.fn(() => Promise.resolve('')),
    logout: jest.fn(),
  })),
};
