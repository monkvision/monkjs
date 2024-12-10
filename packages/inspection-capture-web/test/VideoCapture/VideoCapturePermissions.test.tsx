jest.mock('../../src/VideoCapture/VideoCaptureIntroLayout', () => ({
  VideoCaptureIntroLayout: jest.fn(() => <></>),
  IntroLayoutItem: jest.fn(() => <></>),
}));

import { render, waitFor } from '@testing-library/react';
import { useCameraPermission } from '@monkvision/camera-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { VideoCapturePermissions } from '../../src/VideoCapture/VideoCapturePermissions';
import {
  IntroLayoutItem,
  VideoCaptureIntroLayout,
} from '../../src/VideoCapture/VideoCaptureIntroLayout';

function expectVideoCaptureIntroLayoutConfirmButtonProps(): jest.Mock {
  expectPropsOnChildMock(VideoCaptureIntroLayout, {
    confirmButtonProps: {
      children: 'video.permissions.confirm',
      loading: expect.anything(),
      onClick: expect.any(Function),
    },
  });
  const { onClick } = (VideoCaptureIntroLayout as jest.Mock).mock.calls[0][0].confirmButtonProps;
  return onClick;
}

describe('VideoCapturePermissions component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use the VideoCaptureIntroLayout component for the layout', () => {
    const { unmount } = render(<VideoCapturePermissions />);

    expect(VideoCaptureIntroLayout).toHaveBeenCalled();

    unmount();
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

    const onClick = expectVideoCaptureIntroLayoutConfirmButtonProps();
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

    const onClick = expectVideoCaptureIntroLayoutConfirmButtonProps();
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

    const onClick = expectVideoCaptureIntroLayoutConfirmButtonProps();
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

    const onClick = expectVideoCaptureIntroLayoutConfirmButtonProps();
    onClick();

    await waitFor(() => {
      expect(onSuccess).not.toHaveBeenCalled();
    });

    unmount();
  });

  it('should display an item for the camera permission', () => {
    const { unmount } = render(<VideoCapturePermissions />);
    unmount();

    expect(IntroLayoutItem).not.toHaveBeenCalled();
    const { children } = (VideoCaptureIntroLayout as jest.Mock).mock.calls[0][0];
    const { unmount: unmount2 } = render(children);
    expectPropsOnChildMock(IntroLayoutItem, {
      icon: 'camera-outline',
      title: 'video.permissions.camera.title',
      description: 'video.permissions.camera.description',
    });

    unmount2();
  });

  it('should display an item for the compass permission', () => {
    const { unmount } = render(<VideoCapturePermissions />);
    unmount();

    expect(IntroLayoutItem).not.toHaveBeenCalled();
    const { children } = (VideoCaptureIntroLayout as jest.Mock).mock.calls[0][0];
    const { unmount: unmount2 } = render(children);
    expectPropsOnChildMock(IntroLayoutItem, {
      icon: 'compass-outline',
      title: 'video.permissions.compass.title',
      description: 'video.permissions.compass.description',
    });

    unmount2();
  });
});
