import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useMonkApplicationState } from '@monkvision/common';
import { Navigate } from 'react-router-dom';
import { AuthGuard } from '../../src';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { isTokenExpired, isUserAuthorized, MonkApiPermission } from '@monkvision/network';

describe('AuthGuard component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null while the useMonkApplicationState hook is loading', () => {
    (useMonkApplicationState as jest.Mock).mockImplementationOnce(() => ({ loading: { isLoading: true } }));
    const { container, unmount } = render(<AuthGuard redirectTo=''>Hello</AuthGuard>);

    expect(Navigate).not.toHaveBeenCalled();
    expect(container).toBeEmptyDOMElement();

    unmount();
  });

  it('should redirect the user if the token is null', () => {
    (useMonkApplicationState as jest.Mock).mockImplementationOnce(() => ({ loading: { isLoading: false }, authToken: null }));
    const to = 'redirect-test';
    const content = 'Hello';
    const { unmount } = render(<AuthGuard redirectTo={to}>{content}</AuthGuard>);

    expect(screen.queryByText(content)).toBeNull();
    expectPropsOnChildMock(Navigate, {
      to,
      replace: true,
    })

    unmount();
  });

  it('should redirect the user if the token is expired', () => {
    const authToken = 'test-token-test';
    (useMonkApplicationState as jest.Mock).mockImplementationOnce(() => ({ loading: { isLoading: false }, authToken }));
    (isTokenExpired as jest.Mock).mockImplementationOnce(() => true);
    const to = 'redirect-test';
    const content = 'Hello';
    const { unmount } = render(<AuthGuard redirectTo={to}>{content}</AuthGuard>);

    expect(isTokenExpired).toHaveBeenCalledWith(authToken);
    expect(screen.queryByText(content)).toBeNull();
    expectPropsOnChildMock(Navigate, {
      to,
      replace: true,
    })

    unmount();
  });

  it('should not redirect the user if the user is authorized', () => {
    const authToken = 'test-token-test';
    (useMonkApplicationState as jest.Mock).mockImplementationOnce(() => ({ loading: { isLoading: false }, authToken }));
    (isTokenExpired as jest.Mock).mockImplementationOnce(() => false);
    const content = 'Hello';
    const { unmount } = render(<AuthGuard redirectTo=''>{content}</AuthGuard>);

    expect(Navigate).not.toHaveBeenCalled();
    expect(screen.queryByText(content)).not.toBeNull();

    unmount();
  });

  it('should not redirect the user if the user is authorized and has all the permissions', () => {
    const permissions = [MonkApiPermission.INSPECTION_READ_ORGANIZATION, MonkApiPermission.INSPECTION_READ_ALL];
    const authToken = 'test-token-test';
    (useMonkApplicationState as jest.Mock).mockImplementationOnce(() => ({ loading: { isLoading: false }, authToken }));
    (isTokenExpired as jest.Mock).mockImplementationOnce(() => false);
    (isUserAuthorized as jest.Mock).mockImplementationOnce(() => true);
    const content = 'Hello';
    const { unmount } = render(<AuthGuard redirectTo='' requiredPermissions={permissions}>{content}</AuthGuard>);

    expect(isUserAuthorized).toHaveBeenCalledWith(authToken, permissions);
    expect(Navigate).not.toHaveBeenCalled();
    expect(screen.queryByText(content)).not.toBeNull();

    unmount();
  });

  it('should redirect the user if the user is authorized but does not have all the permissions', () => {
    const permissions = [MonkApiPermission.INSPECTION_READ_ORGANIZATION, MonkApiPermission.INSPECTION_READ_ALL];
    const authToken = 'test-token-test';
    (useMonkApplicationState as jest.Mock).mockImplementationOnce(() => ({ loading: { isLoading: false }, authToken }));
    (isTokenExpired as jest.Mock).mockImplementationOnce(() => false);
    (isUserAuthorized as jest.Mock).mockImplementationOnce(() => false);
    const content = 'Hello';
    const to = 'to-redirect';
    const { unmount } = render(<AuthGuard redirectTo={to} requiredPermissions={permissions}>{content}</AuthGuard>);

    expect(isUserAuthorized).toHaveBeenCalledWith(authToken, permissions);
    expect(screen.queryByText(content)).toBeNull();
    expectPropsOnChildMock(Navigate, {
      to,
      replace: true,
    })

    unmount();
  });
});
