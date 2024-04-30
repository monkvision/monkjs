import { render, screen, waitFor } from '@testing-library/react';
import { Navigate } from 'react-router-dom';
import { useLoadingState, useMonkAppParams } from '@monkvision/common';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { CreateInspectionPage, Page } from '../../src/pages';

const appParams = {
  authToken: 'test-auth-token',
  inspectionId: null,
  setInspectionId: jest.fn(),
};

describe('CreateInspection page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to the PhotoCapture page if the inspectionId is defined', () => {
    (useMonkAppParams as jest.Mock).mockImplementation(() => ({
      ...appParams,
      inspectionId: 'test',
    }));
    const { unmount } = render(<CreateInspectionPage />);

    expectPropsOnChildMock(Navigate, { to: Page.PHOTO_CAPTURE });

    unmount();
  });

  it('should display an error message if the inspection ID is not defined', async () => {
    (useMonkAppParams as jest.Mock).mockImplementation(() => ({ inspectionId: null }));
    const onError = jest.fn();
    const error = 'test-error';
    (useLoadingState as jest.Mock).mockImplementation(() => ({ onError, error, start: jest.fn() }));
    const { unmount } = render(<CreateInspectionPage />);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('create-inspection.errors.missing-inspection-id');
      expect(screen.getByText(error)).not.toBeNull();
    });

    unmount();
  });
});
