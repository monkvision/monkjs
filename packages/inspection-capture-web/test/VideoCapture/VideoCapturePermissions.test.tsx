import { render, waitFor } from '@testing-library/react';
import { useCameraPermission } from '@monkvision/camera-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import { VideoCapturePermissions } from '../../src/VideoCapture/VideoCapturePermissions';

describe('VideoCapturePermissions component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should request compass and camera permissions when pressing on the button', async () => {
    const requestCompassPermission = jest.fn(() => Promise.resolve());
    const { unmount } = render(
      <VideoCapturePermissions requestCompassPermission={requestCompassPermission} />,
    );

    expect(useCameraPermission).toHaveBeenCalled();
    const { requestCameraPermission } = (useCameraPermission as jest.Mock).mock.results[0].value;

    expect(requestCompassPermission).not.toHaveBeenCalled();
    expect(requestCameraPermission).not.toHaveBeenCalled();

    expectPropsOnChildMock(Button, { onClick: expect.any(Function) });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];
    onClick();

    await waitFor(() => {
      expect(requestCompassPermission).toHaveBeenCalled();
      expect(requestCameraPermission).toHaveBeenCalled();
    });

    unmount();
  });

  it('should call the onSuccess callback when the permissions are granted', async () => {
    const onSuccess = jest.fn();
    const requestCompassPermission = jest.fn(() => Promise.resolve());
    const { unmount } = render(
      <VideoCapturePermissions
        onSuccess={onSuccess}
        requestCompassPermission={requestCompassPermission}
      />,
    );

    expectPropsOnChildMock(Button, { onClick: expect.any(Function) });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];
    onClick();

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    unmount();
  });

  it('should not call the onSuccess callback if the compass permission fails', async () => {
    const onSuccess = jest.fn();
    const requestCompassPermission = jest.fn(() => Promise.reject());
    const { unmount } = render(
      <VideoCapturePermissions
        onSuccess={onSuccess}
        requestCompassPermission={requestCompassPermission}
      />,
    );

    expectPropsOnChildMock(Button, { onClick: expect.any(Function) });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];
    onClick();

    await waitFor(() => {
      expect(onSuccess).not.toHaveBeenCalled();
    });

    unmount();
  });

  it('should not call the onSuccess callback if the camera permission fails', async () => {
    const onSuccess = jest.fn();
    const requestCompassPermission = jest.fn(() => Promise.resolve());
    (useCameraPermission as jest.Mock).mockImplementationOnce(() => ({
      requestCameraPermission: jest.fn(() => Promise.reject()),
    }));
    const { unmount } = render(
      <VideoCapturePermissions
        onSuccess={onSuccess}
        requestCompassPermission={requestCompassPermission}
      />,
    );

    expectPropsOnChildMock(Button, { onClick: expect.any(Function) });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls[0][0];
    onClick();

    await waitFor(() => {
      expect(onSuccess).not.toHaveBeenCalled();
    });

    unmount();
  });
});
