import { act } from 'react-dom/test-utils';
import { useNavigate } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useLoadingState, useMonkApplicationState } from '@monkvision/common';
import { isTokenExpired, isUserAuthorized, useAuth } from '@monkvision/network';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import { LogInPage, Page } from '../../src/pages';

const appParams = {
  authToken: 'test-auth-token',
  inspectionId: 'test-inspection-id',
  setAuthToken: jest.fn(),
};

describe('Log In page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a login button on the screen', async () => {
    (useMonkApplicationState as jest.Mock).mockImplementation(() => ({ ...appParams, authToken: null }));
    const { unmount } = render(<LogInPage />);

    expectPropsOnChildMock(Button, {
      onClick: expect.any(Function),
      children: 'login.actions.log-in',
    });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];
    expect(useAuth).toHaveBeenCalled();
    const { login } = (useAuth as jest.Mock).mock.results[0].value;

    act(() => onClick());
    expect(login).toHaveBeenCalled();

    unmount();
  });

  it('should redirect to the PhotoCapture page after the login if the inspectionId is defined', async () => {
    (useMonkApplicationState as jest.Mock).mockImplementation(() => ({ ...appParams, authToken: null }));
    const { unmount } = render(<LogInPage />);

    expect(Button).toHaveBeenCalled();
    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];
    expect(useNavigate).toHaveBeenCalled();
    const navigate = (useNavigate as jest.Mock).mock.results[0].value;

    act(() => onClick());
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(Page.PHOTO_CAPTURE);
    });

    unmount();
  });

  it('should redirect to the CreateInspection page after the login if the inspectionId is not defined', async () => {
    (useMonkApplicationState as jest.Mock).mockImplementation(() => ({
      ...appParams,
      authToken: null,
      inspectionId: null,
    }));
    const { unmount } = render(<LogInPage />);

    expect(Button).toHaveBeenCalled();
    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];
    expect(useNavigate).toHaveBeenCalled();
    const navigate = (useNavigate as jest.Mock).mock.results[0].value;

    act(() => onClick());
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(Page.CREATE_INSPECTION);
    });

    unmount();
  });

  it('should not redirect after log in if the user does not have sufficient authorization', async () => {
    (useMonkApplicationState as jest.Mock).mockImplementation(() => ({ ...appParams, authToken: null }));
    (isUserAuthorized as jest.Mock).mockImplementation(() => false);
    const onError = jest.fn();
    const error = 'test-error';
    (useLoadingState as jest.Mock).mockImplementation(() => ({ onError, error, start: jest.fn() }));
    const { unmount } = render(<LogInPage />);

    expect(Button).toHaveBeenCalled();
    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];
    expect(useNavigate).toHaveBeenCalled();
    const navigate = (useNavigate as jest.Mock).mock.results[0].value;

    act(() => onClick());
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('login.errors.insufficient-authorization');
      expect(navigate).not.toHaveBeenCalled();
      expect(screen.queryByText(error)).not.toBeNull();
    });

    unmount();
  });

  it('should display an error message and a log out button if the user does not have sufficient authorizations', async () => {
    (useMonkApplicationState as jest.Mock).mockImplementation(() => appParams);
    (isUserAuthorized as jest.Mock).mockImplementation(() => false);
    const onError = jest.fn();
    const error = 'test-error';
    (useLoadingState as jest.Mock).mockImplementation(() => ({ onError, error }));
    const { unmount } = render(<LogInPage />);

    expect(onError).toHaveBeenCalledWith('login.errors.insufficient-authorization');
    expect(screen.queryByText(error)).not.toBeNull();

    expectPropsOnChildMock(Button, {
      primaryColor: 'alert',
      onClick: expect.any(Function),
      children: 'login.actions.log-out',
    });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];
    expect(useAuth).toHaveBeenCalled();
    const { logout } = (useAuth as jest.Mock).mock.results[0].value;
    expect(logout).not.toHaveBeenCalled();

    await act(() => onClick());
    expect(logout).toHaveBeenCalled();

    unmount();
  });

  it('should display an error message on the screen if the token was expired', async () => {
    (useMonkApplicationState as jest.Mock).mockImplementation(() => appParams);
    (isTokenExpired as jest.Mock).mockImplementation(() => true);
    const { unmount } = render(<LogInPage />);

    expect(isTokenExpired).toHaveBeenCalledWith(appParams.authToken);
    expect(appParams.setAuthToken).toHaveBeenCalledWith(null);
    expect(screen.queryByText('login.errors.token-expired')).not.toBeNull();

    unmount();
  });

  [
    {
      testCase: 'when the user closes the log in pop up',
      err: new Error('Popup closed'),
      label: 'login.errors.popup-closed',
    },
    {
      testCase: 'when an unexpected error occurrs during the log in',
      err: new Error(),
      label: 'login.errors.unknown',
    },
  ].forEach(({ testCase, err, label }) => {
    it(`should not redirect and display the proper error message ${testCase}`, async () => {
      (useMonkApplicationState as jest.Mock).mockImplementation(() => ({ ...appParams, authToken: null }));
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: jest.fn(() => Promise.reject(err)),
      }));
      const onError = jest.fn();
      const error = 'test-error';
      (useLoadingState as jest.Mock).mockImplementation(() => ({
        onError,
        error,
        start: jest.fn(),
      }));
      const { unmount } = render(<LogInPage />);

      expect(Button).toHaveBeenCalled();
      const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];

      act(() => onClick());
      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(label);
        expect(screen.queryByText(error)).not.toBeNull();
      });

      unmount();
    });
  });
});
