jest.mock('../../src/components/Button', () => ({
  Button: jest.fn(({ children }) => <div>{children}</div>),
}));

import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { act, render, screen, waitFor } from '@testing-library/react';
import { useLoadingState, useMonkApplicationState } from '@monkvision/common';
import { isTokenExpired, isUserAuthorized, MonkApiPermission, useAuth } from '@monkvision/network';
import { Button, Login, LoginProps } from '../../src';

const appState = {
  authToken: 'test-auth-token',
  inspectionId: 'test-inspection-id',
  setAuthToken: jest.fn(),
};

function createProps(): LoginProps {
  return {
    allowManualLogin: true,
    onLoginSuccessful: jest.fn(),
  };
}

function useUnauthorizedUser() {
  (isUserAuthorized as jest.Mock).mockImplementation(() => false);
}

function useExpiredToken() {
  (isTokenExpired as jest.Mock).mockImplementation(() => true);
}

function getHandleLoginFunction() {
  expectPropsOnChildMock(Button, { children: 'actions.log-in', onClick: expect.any(Function) });
  return (Button as unknown as jest.Mock).mock.calls.find(
    (call) => call[0].children === 'actions.log-in',
  )[0].onClick;
}

describe('Login page', () => {
  const onSuccess = jest.fn();
  const onError = jest.fn();
  const error = 'test-error';

  beforeEach(() => {
    (useLoadingState as jest.Mock).mockImplementation(() => ({
      onError,
      onSuccess,
      error,
      start: jest.fn(),
    }));
    (useMonkApplicationState as jest.Mock).mockImplementation(() => appState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display an error message if the token is not defined and manual login is disabled', () => {
    const props = createProps();
    props.allowManualLogin = false;
    (useMonkApplicationState as jest.Mock).mockImplementation(() => ({
      ...appState,
      authToken: null,
    }));
    const { unmount } = render(<Login {...props} allowManualLogin={false} />);

    expect(onError).toHaveBeenCalledWith('errors.missing-token');
    expect(props.onLoginSuccessful).not.toHaveBeenCalled();
    expect(screen.queryByText(error)).not.toBeNull();

    unmount();
  });

  it('should display an error message with a log out button if the user does not have the required permissions', () => {
    const props = createProps();
    props.requiredPermissions = [MonkApiPermission.INSPECTION_UPDATE_ORGANIZATION];
    useUnauthorizedUser();
    const { unmount } = render(<Login {...props} />);

    expect(isUserAuthorized).toHaveBeenCalledWith(appState.authToken, props.requiredPermissions);
    expect(onError).toHaveBeenCalledWith('errors.insufficient-authorization');
    expect(props.onLoginSuccessful).not.toHaveBeenCalled();
    expect(screen.queryByText(error)).not.toBeNull();
    expect(screen.queryByText('actions.log-out')).not.toBeNull();

    unmount();
  });

  it('should display an error message but no log out button if user unauthorized with manual login disabled', () => {
    const props = createProps();
    props.requiredPermissions = [MonkApiPermission.INSPECTION_UPDATE_ORGANIZATION];
    props.allowManualLogin = false;
    useUnauthorizedUser();
    const { unmount } = render(<Login {...props} />);

    expect(isUserAuthorized).toHaveBeenCalledWith(appState.authToken, props.requiredPermissions);
    expect(onError).toHaveBeenCalledWith('errors.insufficient-authorization');
    expect(props.onLoginSuccessful).not.toHaveBeenCalled();
    expect(screen.queryByText(error)).not.toBeNull();
    expect(screen.queryByText('actions.log-out')).toBeNull();

    unmount();
  });

  it('should log the user out if the token is expired and display the proper error message', () => {
    const props = createProps();
    useExpiredToken();
    const { unmount } = render(<Login {...props} />);

    expect(isTokenExpired).toHaveBeenCalledWith(appState.authToken);
    expect(props.onLoginSuccessful).not.toHaveBeenCalled();
    expect(screen.queryByText('errors.token-expired')).not.toBeNull();
    expect(appState.setAuthToken).toHaveBeenCalledWith(null);
    expect(screen.queryByText('actions.log-out')).not.toBeNull();

    unmount();
  });

  it('should call onLoginSuccessful after a successful login', async () => {
    const props = createProps();
    (useMonkApplicationState as jest.Mock).mockImplementation(() => ({
      ...appState,
      authToken: null,
    }));
    const login = jest.fn(() => Promise.resolve(appState.authToken));
    (useAuth as jest.Mock).mockImplementation(() => ({ login }));
    const { unmount } = render(<Login {...props} />);

    const handleLogin = getHandleLoginFunction();
    act(() => handleLogin());
    await waitFor(() => {
      expect(login).toHaveBeenCalled();
      expect(props.onLoginSuccessful).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });

    unmount();
  });

  it('should display an error message with the logout button if user is unauthorized after login', async () => {
    const props = createProps();
    props.requiredPermissions = [MonkApiPermission.INSPECTION_CREATE];
    (useMonkApplicationState as jest.Mock).mockImplementation(() => ({
      ...appState,
      authToken: null,
    }));
    const login = jest.fn(() => Promise.resolve(appState.authToken));
    (useAuth as jest.Mock).mockImplementation(() => ({ login }));
    useUnauthorizedUser();
    const { unmount } = render(<Login {...props} />);

    const handleLogin = getHandleLoginFunction();
    act(() => handleLogin());
    await waitFor(() => {
      expect(login).toHaveBeenCalled();
      expect(props.onLoginSuccessful).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith('errors.insufficient-authorization');
      expect(screen.queryByText(error)).not.toBeNull();
    });

    unmount();
  });

  [
    {
      testCase: 'when the user closes the log in pop up',
      err: new Error('Popup closed'),
      label: 'errors.popup-closed',
    },
    {
      testCase: 'when an unexpected error occurrs during the log in',
      err: new Error(),
      label: 'errors.unknown',
    },
  ].forEach(({ testCase, err, label }) => {
    it(`should not call onLoginSuccessful and display the proper error message ${testCase}`, async () => {
      const props = createProps();
      (useMonkApplicationState as jest.Mock).mockImplementation(() => ({
        ...appState,
        authToken: null,
      }));
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: jest.fn(() => Promise.reject(err)),
      }));
      const { unmount } = render(<Login {...props} />);

      const handleLogin = getHandleLoginFunction();
      act(() => handleLogin());
      await waitFor(() => {
        expect(props.onLoginSuccessful).not.toHaveBeenCalled();
        expect(onSuccess).not.toHaveBeenCalled();
        expect(onError).toHaveBeenCalledWith(label);
        expect(screen.queryByText(error)).not.toBeNull();
      });

      unmount();
    });
  });

  it('should properly logout the user when the user clicks on the logout button', async () => {
    (useAuth as jest.Mock).mockImplementation(() => ({
      logout: jest.fn(() => Promise.resolve()),
    }));
    const props = createProps();
    const { unmount } = render(<Login {...props} />);

    expect(useAuth).toHaveBeenCalled();
    const { logout } = (useAuth as jest.Mock).mock.results[0].value;
    expectPropsOnChildMock(Button, { children: 'actions.log-out', onClick: expect.any(Function) });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls.find(
      (call) => call[0].children === 'actions.log-out',
    )[0];
    expect(logout).not.toHaveBeenCalled();
    onClick();
    expect(logout).toHaveBeenCalled();

    unmount();
  });
});
