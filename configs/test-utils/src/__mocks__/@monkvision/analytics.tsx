class AnalyticsAdapterMock {
  setUserId = jest.fn();
  setUserProperties = jest.fn();
  resetUser = jest.fn();
  trackEvent = jest.fn();
  setEventsProperties = jest.fn();
  getUserId = jest.fn(() => 'test-user-id');
}

export = {
  /* Custom Mock Exports */
  AnalyticsAdapterMock,

  /* Mocks */
  EmptyAnalyticsAdapter: AnalyticsAdapterMock,
  useAnalytics: jest.fn(() => ({
    setUserId: jest.fn(),
    setUserProperties: jest.fn(),
    resetUser: jest.fn(),
    trackEvent: jest.fn(),
    setEventsProperties: jest.fn(),
    getUserId: jest.fn(() => 'test-user-id'),
  })),
  AnalyticsProvider: jest.fn(({ children }) => <>{children}</>),
};
