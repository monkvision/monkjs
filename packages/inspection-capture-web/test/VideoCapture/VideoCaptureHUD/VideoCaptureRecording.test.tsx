import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import {
  RecordVideoButton,
  TakePictureButton,
  VehicleWalkaroundIndicator,
} from '@monkvision/common-ui-web';
import { VideoCaptureRecording } from '../../../src/VideoCapture/VideoCaptureHUD/VideoCaptureRecording';

const VEHICLE_WALKAROUND_INDICATOR_CONTAINER_TEST_ID = 'walkaround-indicator-container';

describe('VideoCaptureRecording component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the VehicleWalkaroundIndicator component', () => {
    const walkaroundPosition = 344.7;
    const { unmount } = render(
      <VideoCaptureRecording walkaroundPosition={walkaroundPosition} isRecording />,
    );

    expectPropsOnChildMock(VehicleWalkaroundIndicator, { alpha: walkaroundPosition });

    unmount();
  });

  it('should change the style of the VehicleWalkaroundIndicator component when not recording', () => {
    const disabledStyle = {
      filter: 'grayscale(1)',
      opacity: 0.7,
    };
    const { rerender, unmount } = render(
      <VideoCaptureRecording walkaroundPosition={35} isRecording={false} />,
    );
    expect(screen.queryByTestId(VEHICLE_WALKAROUND_INDICATOR_CONTAINER_TEST_ID)).toHaveStyle(
      disabledStyle,
    );

    rerender(<VideoCaptureRecording walkaroundPosition={22} isRecording />);
    expect(screen.queryByTestId(VEHICLE_WALKAROUND_INDICATOR_CONTAINER_TEST_ID)).not.toHaveStyle(
      disabledStyle,
    );

    unmount();
  });

  it('should display the RecordVideoButton and pass it the recording state', () => {
    const { rerender, unmount } = render(
      <VideoCaptureRecording walkaroundPosition={22} isRecording />,
    );

    expectPropsOnChildMock(RecordVideoButton, { isRecording: true });
    rerender(<VideoCaptureRecording walkaroundPosition={22} isRecording={false} />);
    expectPropsOnChildMock(RecordVideoButton, { isRecording: false });

    unmount();
  });

  it('should call the onClickRecordVideo callback when the user clicks on the RecordVideoButton', () => {
    const onClickRecordVideo = jest.fn();
    const { unmount } = render(
      <VideoCaptureRecording
        walkaroundPosition={22}
        isRecording
        onClickRecordVideo={onClickRecordVideo}
      />,
    );

    expectPropsOnChildMock(RecordVideoButton, { onClick: expect.any(Function) });
    const { onClick } = (RecordVideoButton as unknown as jest.Mock).mock.calls[0][0];
    expect(onClickRecordVideo).not.toHaveBeenCalled();
    act(() => {
      onClick();
    });
    expect(onClickRecordVideo).toHaveBeenCalled();

    unmount();
  });

  it('should display the TakePictureButton', () => {
    const { unmount } = render(<VideoCaptureRecording walkaroundPosition={22} isRecording />);

    expect(TakePictureButton).toHaveBeenCalled();

    unmount();
  });

  it('should disable the TakePictureButton when not recording', () => {
    const { rerender, unmount } = render(
      <VideoCaptureRecording walkaroundPosition={22} isRecording />,
    );

    expectPropsOnChildMock(TakePictureButton, { disabled: false });
    rerender(<VideoCaptureRecording walkaroundPosition={22} isRecording={false} />);
    expectPropsOnChildMock(TakePictureButton, { disabled: true });

    unmount();
  });

  it('should call the onClickTakePicture callback when the user clicks on the TakePictureButton', () => {
    const onClickTakePicture = jest.fn();
    const { unmount } = render(
      <VideoCaptureRecording
        walkaroundPosition={22}
        isRecording
        onClickTakePicture={onClickTakePicture}
      />,
    );

    expectPropsOnChildMock(TakePictureButton, { onClick: expect.any(Function) });
    const { onClick } = (TakePictureButton as unknown as jest.Mock).mock.calls[0][0];
    expect(onClickTakePicture).not.toHaveBeenCalled();
    act(() => {
      onClick();
    });
    expect(onClickTakePicture).toHaveBeenCalled();

    unmount();
  });
});
