const mockAuth0Provider = ({ children, ...props }: any) => {
  (global as any).__auth0ProviderLastProps = props;
  return <>{children}</>;
};

export = {
  /* Actual exports */
  /* Mocks */
  useAuth0: jest.fn(() => ({
    getAccessTokenWithPopup: jest.fn(() => Promise.resolve('')),
    logout: jest.fn(),
  })),
  Auth0Provider: mockAuth0Provider,
};
