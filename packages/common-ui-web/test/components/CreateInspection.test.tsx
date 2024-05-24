jest.mock('../../src/components/Button', () => ({
  Button: jest.fn(() => <></>),
}));
jest.mock('../../src/components/Spinner', () => ({
  Spinner: jest.fn(() => <></>),
}));

import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useLoadingState, useMonkAppState } from '@monkvision/common';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { useMonkApi } from '@monkvision/network';
import { CreateInspection, Button } from '../../src';

const appState = {
  authToken: 'test-auth-token',
  inspectionId: null,
  setInspectionId: jest.fn(),
  config: {
    apiDomain: 'test-api-domain',
    allowCreateInspection: true,
    createInspectionOptions: { test: 'hello' },
  },
};

describe('CreateInspection page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should directly call the onInspectionCreated callback if the inspectionId is defined', () => {
    const onInspectionCreated = jest.fn();
    (useMonkAppState as jest.Mock).mockImplementation(() => ({
      ...appState,
      inspectionId: 'test',
    }));
    const { unmount } = render(<CreateInspection onInspectionCreated={onInspectionCreated} />);

    expect(onInspectionCreated).toHaveBeenCalled();

    unmount();
  });

  it('should create the inspection and then call the onInspectionCreated callback if the inspectionId is not defined', async () => {
    const id = 'test-id-test';
    const createInspection = jest.fn(() => Promise.resolve({ id }));
    (useMonkApi as jest.Mock).mockImplementation(() => ({ createInspection }));
    (useMonkAppState as jest.Mock).mockImplementation(() => appState);
    const onInspectionCreated = jest.fn();
    const { unmount } = render(<CreateInspection onInspectionCreated={onInspectionCreated} />);

    expect(useMonkApi).toHaveBeenCalledWith({
      apiDomain: appState.config.apiDomain,
      authToken: appState.authToken,
    });
    expect(createInspection).toHaveBeenCalledWith(appState.config.createInspectionOptions);
    await waitFor(() => {
      expect(appState.setInspectionId).toHaveBeenCalledWith(id);
    });

    unmount();
  });

  it('should display an error message if the API call fails', async () => {
    const createInspection = jest.fn(() => Promise.reject());
    (useMonkApi as jest.Mock).mockImplementation(() => ({ createInspection }));
    (useMonkAppState as jest.Mock).mockImplementation(() => appState);
    const onError = jest.fn();
    const error = 'test-error';
    (useLoadingState as jest.Mock).mockImplementation(() => ({ onError, error, start: jest.fn() }));
    const { unmount } = render(<CreateInspection />);

    await waitFor(() => {
      expect(appState.setInspectionId).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith('errors.create-inspection');
      expect(screen.queryByText('test-error')).not.toBeNull();
    });

    unmount();
  });

  it('should display a retry button if the API call fails', async () => {
    const createInspection = jest.fn(() => Promise.reject());
    (useMonkApi as jest.Mock).mockImplementation(() => ({ createInspection }));
    (useMonkAppState as jest.Mock).mockImplementation(() => appState);
    const onError = jest.fn();
    const error = 'errors.create-inspection';
    (useLoadingState as jest.Mock).mockImplementation(() => ({ onError, error, start: jest.fn() }));
    const { unmount } = render(<CreateInspection />);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('errors.create-inspection');
      expectPropsOnChildMock(Button, {
        variant: 'outline',
        icon: 'refresh',
        onClick: expect.any(Function),
      });
    });

    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];

    createInspection.mockClear();
    act(() => onClick());
    expect(createInspection).toHaveBeenCalled();

    unmount();
  });

  it('should display an error message if the inspection ID is not defined and creation is not enabled', async () => {
    const createInspection = jest.fn(() => Promise.reject());
    (useMonkApi as jest.Mock).mockImplementation(() => ({ createInspection }));
    (useMonkAppState as jest.Mock).mockImplementation(() => ({
      ...appState,
      inspectionId: null,
      config: { allowCreateInspection: false },
    }));
    const onError = jest.fn();
    const error = 'test-error';
    (useLoadingState as jest.Mock).mockImplementation(() => ({ onError, error, start: jest.fn() }));
    const { unmount } = render(<CreateInspection />);

    await waitFor(() => {
      expect(appState.setInspectionId).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith('errors.missing-inspection-id');
      expect(screen.queryByText('test-error')).not.toBeNull();
      expect(Button).not.toHaveBeenCalled();
    });

    unmount();
  });
});
