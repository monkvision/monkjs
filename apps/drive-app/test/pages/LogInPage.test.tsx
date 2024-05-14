import { useNavigate } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useLoadingState, useMonkApplicationState } from '@monkvision/common';
import { LogInPage } from '../../src/pages';

const appParams = {
  authToken: 'test-auth-token',
  inspectionId: 'test-inspection-id',
  setAuthToken: jest.fn(),
};

describe('Log In page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display an error message if the token is not defined', async () => {
    (useMonkApplicationState as jest.Mock).mockImplementation(() => ({ ...appParams, authToken: null }));
    const onError = jest.fn();
    const error = 'test-error';
    (useLoadingState as jest.Mock).mockImplementation(() => ({ onError, error, start: jest.fn() }));
    const { unmount } = render(<LogInPage />);

    expect(useNavigate).toHaveBeenCalled();
    const navigate = (useNavigate as jest.Mock).mock.results[0].value;

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('login.errors.missing-token');
      expect(navigate).not.toHaveBeenCalled();
      expect(screen.queryByText(error)).not.toBeNull();
    });

    unmount();
  });
});
