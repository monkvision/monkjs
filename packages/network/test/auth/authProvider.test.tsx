import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { STORAGE_KEY_AUTH_TOKEN } from '@monkvision/common';
import { AuthConfig } from '../../src/auth/authProvider.types';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('../../src/auth/token', () => ({
  getApiConfigOrThrow: jest.fn(),
  isTokenValid: jest.fn(),
}));

import { AuthProvider } from '../../src/auth/authProvider';
import { getApiConfigOrThrow, isTokenValid } from '../../src/auth/token';

function createConfigs(): AuthConfig[] {
  return [
    {
      clientId: 'client-A',
      domain: 'a.auth0.com',
      authorizationParams: { redirect_uri: 'https://a.example.com' },
      context: undefined,
    },
    {
      clientId: 'client-B',
      domain: 'b.auth0.com',
      authorizationParams: { redirect_uri: 'https://b.example.com' },
      context: undefined,
    },
  ];
}

describe('AuthProvider component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    delete (global as any).__auth0ProviderLastProps;
  });

  it('should renders children and passes correct props to Auth0Provider', () => {
    const childTestId = 'child-test';
    const configs = createConfigs();
    (getApiConfigOrThrow as jest.Mock).mockReturnValue(configs[0]);

    render(
      <AuthProvider configs={configs}>
        <div data-testid={childTestId} />
      </AuthProvider>,
    );

    expect(screen.getByTestId(childTestId)).toBeInTheDocument();
    const lastProps = (global as any).__auth0ProviderLastProps;
    expect(lastProps).toMatchObject(configs[0]);
  });

  it('should calls logout and clears token when token is invalid', () => {
    const childTestId = 'child-test';
    const configs = createConfigs();
    (getApiConfigOrThrow as jest.Mock).mockReturnValue(configs[1]);
    (isTokenValid as jest.Mock).mockReturnValue(false);

    localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, 'auth-token-test');

    render(
      <AuthProvider configs={configs}>
        <div data-testid={childTestId} />
      </AuthProvider>,
    );

    const useAuth0Mock = (useAuth0 as jest.Mock).mock.results[0].value;
    expect(localStorage.getItem(STORAGE_KEY_AUTH_TOKEN)).toBeNull();
    expect(useAuth0Mock.logout).toHaveBeenCalled();
  });

  it('should not call logout when there is no token in localStorage', () => {
    const childTestId = 'child-test';
    const configs = createConfigs();
    (getApiConfigOrThrow as jest.Mock).mockReturnValue(configs[1]);
    (isTokenValid as jest.Mock).mockReturnValue(false);

    render(
      <AuthProvider configs={configs}>
        <div data-testid={childTestId} />
      </AuthProvider>,
    );

    const useAuth0Mock = (useAuth0 as jest.Mock).mock.results[0].value;
    expect(useAuth0Mock.logout).not.toHaveBeenCalled();
  });

  it('should update Auth0Provider props for different configs', () => {
    const childTestId = 'child-test';
    const configs = createConfigs();
    (getApiConfigOrThrow as jest.Mock).mockReturnValue(configs[1]);
    render(
      <AuthProvider configs={configs}>
        <div data-testid={childTestId} />
      </AuthProvider>,
    );
    const lastProps = (global as any).__auth0ProviderLastProps;
    expect(lastProps).toMatchObject(configs[1]);
  });
});
