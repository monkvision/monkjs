import { render, screen, waitFor } from '@testing-library/react';
import { Navigate } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { useLoadingState, useMonkApplicationState } from '@monkvision/common';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { useMonkApi } from '@monkvision/network';
import { TaskName } from '@monkvision/types';
import { Button } from '@monkvision/common-ui-web';
import { CreateInspectionPage, Page } from '../../src/pages';

const appState = {
  authToken: 'test-auth-token',
  inspectionId: null,
  setInspectionId: jest.fn(),
};

describe('CreateInspection page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to the PhotoCapture page if the inspectionId is defined', () => {
    (useMonkApplicationState as jest.Mock).mockImplementation(() => ({
      ...appState,
      inspectionId: 'test',
    }));
    const { unmount } = render(<CreateInspectionPage />);

    expectPropsOnChildMock(Navigate, { to: Page.PHOTO_CAPTURE });

    unmount();
  });

  it('should create the inspection and then redirect to the PhotoCapture page if the inspectionId is not defined', async () => {
    const id = 'test-id-test';
    const createInspection = jest.fn(() => Promise.resolve({ id }));
    (useMonkApi as jest.Mock).mockImplementation(() => ({ createInspection }));
    (useMonkApplicationState as jest.Mock).mockImplementation(() => appState);
    const { unmount } = render(<CreateInspectionPage />);

    expect(createInspection).toHaveBeenCalledWith({
      tasks: [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS],
    });
    await waitFor(() => {
      expect(appState.setInspectionId).toHaveBeenCalledWith(id);
    });

    unmount();
  });

  it('should display an error message if the API call fails', async () => {
    const createInspection = jest.fn(() => Promise.reject());
    (useMonkApi as jest.Mock).mockImplementation(() => ({ createInspection }));
    (useMonkApplicationState as jest.Mock).mockImplementation(() => appState);
    const onError = jest.fn();
    const error = 'test-error';
    (useLoadingState as jest.Mock).mockImplementation(() => ({ onError, error, start: jest.fn() }));
    const { unmount } = render(<CreateInspectionPage />);

    await waitFor(() => {
      expect(appState.setInspectionId).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
      expect(screen.queryByText('create-inspection.errors.create-inspection')).not.toBeNull();
    });

    unmount();
  });

  it('should display a retry button if the API call fails', async () => {
    const createInspection = jest.fn(() => Promise.reject());
    (useMonkApi as jest.Mock).mockImplementation(() => ({ createInspection }));
    (useMonkApplicationState as jest.Mock).mockImplementation(() => appState);
    (useLoadingState as jest.Mock).mockImplementation(() => ({
      onError: jest.fn(),
      error: 'test-error',
      start: jest.fn(),
    }));
    const { unmount } = render(<CreateInspectionPage />);

    expectPropsOnChildMock(Button, {
      variant: 'outline',
      icon: 'refresh',
      onClick: expect.any(Function),
    });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];

    createInspection.mockClear();
    act(() => onClick());
    expect(createInspection).toHaveBeenCalled();

    unmount();
  });
});
