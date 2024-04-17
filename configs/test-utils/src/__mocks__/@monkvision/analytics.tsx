class AnalyticsAdapterMock {
  setUserId = jest.fn();
  setUserProperties = jest.fn();
  resetUser = jest.fn();
  trackEvent = jest.fn();
  setEventsProperties = jest.fn();
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
  })),
  AnalyticsProvider: jest.fn(({ children }) => <>{children}</>),
};
