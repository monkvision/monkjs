jest.mock('react-router-dom', () => ({
  Navigate: jest.fn(({ to, replace }) => (
    <div>{`Redirect to ${to}${replace ? ' with replace' : ''}`}</div>
  )),
}));

import { useMonkAppParams } from '@monkvision/common';
import { render, screen } from '@testing-library/react';
import { isTokenExpired, isUserAuthorized, MonkApiPermission } from '@monkvision/network';
import { AuthGuard } from '../../src/components';
import { Page } from '../../src/pages';

const redirectText = `Redirect to ${Page.LOG_IN} with replace`;
const childTestId = 'child-test-id';
const child = <div data-testid={childTestId} />;

function expectRedirect() {
  expect(screen.queryByTestId(childTestId)).toBeNull();
  expect(screen.queryByText(redirectText)).not.toBeNull();
}

function expectNoRedirect() {
  expect(screen.queryByTestId(childTestId)).not.toBeNull();
  expect(screen.queryByText(redirectText)).toBeNull();
}

function mockAuthToken(params: {
  defined: boolean;
  authorized: boolean;
  expired: boolean;
}): string | null {
  const authToken = params.defined ? 'test-auth-token-test' : null;
  (useMonkAppParams as jest.Mock).mockImplementation(() => ({ authToken }));
  (isUserAuthorized as jest.Mock).mockImplementation(() => params.authorized);
  (isTokenExpired as jest.Mock).mockImplementation(() => params.expired);
  return authToken;
}

describe('AuthGuard component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect the user if the authToken is not defined', () => {
    mockAuthToken({ defined: false, authorized: true, expired: false });
    const { unmount } = render(<AuthGuard>{child}</AuthGuard>);

    expectRedirect();

    unmount();
  });

  it('should redirect the user if the user does not have the proper authorizations', () => {
    const token = mockAuthToken({ defined: true, authorized: false, expired: false });
    const { unmount } = render(<AuthGuard>{child}</AuthGuard>);

    expect(isUserAuthorized).toHaveBeenCalledWith(token, [
      MonkApiPermission.TASK_COMPLIANCES,
      MonkApiPermission.TASK_DAMAGE_DETECTION,
      MonkApiPermission.TASK_DAMAGE_IMAGES_OCR,
      MonkApiPermission.TASK_WHEEL_ANALYSIS,
      MonkApiPermission.INSPECTION_CREATE,
      MonkApiPermission.INSPECTION_READ,
      MonkApiPermission.INSPECTION_UPDATE,
      MonkApiPermission.INSPECTION_WRITE,
    ]);
    expectRedirect();

    unmount();
  });

  it('should redirect the user if the token is expired', () => {
    const token = mockAuthToken({ defined: true, authorized: true, expired: true });
    const { unmount } = render(<AuthGuard>{child}</AuthGuard>);

    expect(isTokenExpired).toHaveBeenCalledWith(token);
    expectRedirect();

    unmount();
  });

  it('should not redirect the user if the token is valid', () => {
    mockAuthToken({ defined: true, authorized: true, expired: false });
    const { unmount } = render(<AuthGuard>{child}</AuthGuard>);

    expectNoRedirect();

    unmount();
  });
});
