import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import {
  RecordVideoButton,
  TakePictureButton,
  VehicleWalkaroundIndicator,
} from '@monkvision/common-ui-web';
import {
  VideoCaptureRecording,
  VideoCaptureRecordingProps,
} from '../../../src/VideoCapture/VideoCaptureHUD/VideoCaptureRecording';
import { useWindowDimensions } from '@monkvision/common';

const VEHICLE_WALKAROUND_INDICATOR_CONTAINER_TEST_ID = 'walkaround-indicator-container';

function createProps(): VideoCaptureRecordingProps {
  return {
    walkaroundPosition: 200,
    isRecording: false,
    isRecordingPaused: false,
    recordingDurationMs: 75800,
    onClickRecordVideo: jest.fn(),
    onClickTakePicture: jest.fn(),
    tooltip: 'test-tooltip',
  };
}

describe('VideoCaptureRecording component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the VehicleWalkaroundIndicator component', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureRecording {...props} />);

    expectPropsOnChildMock(VehicleWalkaroundIndicator, { alpha: props.walkaroundPosition });

    unmount();
  });

  it('should change the style of the VehicleWalkaroundIndicator component when not recording', () => {
    const props = createProps();
    const disabledStyle = {
      filter: 'grayscale(1)',
      opacity: 0.7,
    };
    const { rerender, unmount } = render(
      <VideoCaptureRecording {...props} isRecording={true} isRecordingPaused={false} />,
    );
    expect(screen.getByTestId(VEHICLE_WALKAROUND_INDICATOR_CONTAINER_TEST_ID)).not.toHaveStyle(
      disabledStyle,
    );

    rerender(<VideoCaptureRecording {...props} isRecording={false} isRecordingPaused={true} />);
    expect(screen.getByTestId(VEHICLE_WALKAROUND_INDICATOR_CONTAINER_TEST_ID)).toHaveStyle(
      disabledStyle,
    );

    rerender(<VideoCaptureRecording {...props} isRecording={false} isRecordingPaused={false} />);
    expect(screen.getByTestId(VEHICLE_WALKAROUND_INDICATOR_CONTAINER_TEST_ID)).toHaveStyle(
      disabledStyle,
    );

    unmount();
  });

  it('should display the RecordVideoButton and pass it the recording state', () => {
    const props = createProps();
    const { rerender, unmount } = render(<VideoCaptureRecording {...props} isRecording={true} />);

    expectPropsOnChildMock(RecordVideoButton, { isRecording: true });
    rerender(<VideoCaptureRecording {...props} isRecording={false} />);
    expectPropsOnChildMock(RecordVideoButton, { isRecording: false });

    unmount();
  });

  it('should call the onClickRecordVideo callback when the user clicks on the RecordVideoButton', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureRecording {...props} />);

    expectPropsOnChildMock(RecordVideoButton, { onClick: expect.any(Function) });
    const { onClick } = (RecordVideoButton as unknown as jest.Mock).mock.calls[0][0];
    expect(props.onClickRecordVideo).not.toHaveBeenCalled();
    act(() => {
      onClick();
    });
    expect(props.onClickRecordVideo).toHaveBeenCalled();

    unmount();
  });

  it('should pass the tooltip to the RecordVideoButton component', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureRecording {...props} />);

    expectPropsOnChildMock(RecordVideoButton, { tooltip: props.tooltip });

    unmount();
  });

  it('should pass set the RecordVideoButton tooltip position to up when in portrait', () => {
    (useWindowDimensions as jest.Mock).mockImplementationOnce(() => ({ isPortrait: true }));
    const props = createProps();
    const { unmount } = render(<VideoCaptureRecording {...props} />);

    expectPropsOnChildMock(RecordVideoButton, { tooltipPosition: 'up' });

    unmount();
  });

  it('should pass set the RecordVideoButton tooltip position to left when in landscape', () => {
    (useWindowDimensions as jest.Mock).mockImplementationOnce(() => ({ isPortrait: false }));
    const props = createProps();
    const { unmount } = render(<VideoCaptureRecording {...props} />);

    expectPropsOnChildMock(RecordVideoButton, { tooltipPosition: 'left' });

    unmount();
  });

  it('should display the TakePictureButton', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureRecording {...props} />);

    expect(TakePictureButton).toHaveBeenCalled();

    unmount();
  });

  it('should disable the TakePictureButton when not recording', () => {
    const props = createProps();
    const { rerender, unmount } = render(<VideoCaptureRecording {...props} isRecording={true} />);

    expectPropsOnChildMock(TakePictureButton, { disabled: false });
    rerender(<VideoCaptureRecording {...props} isRecording={false} />);
    expectPropsOnChildMock(TakePictureButton, { disabled: true });

    unmount();
  });

  it('should call the onClickTakePicture callback when the user clicks on the TakePictureButton', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureRecording {...props} isRecording={true} />);

    expectPropsOnChildMock(TakePictureButton, { onClick: expect.any(Function) });
    const { onClick } = (TakePictureButton as unknown as jest.Mock).mock.calls[0][0];
    expect(props.onClickTakePicture).not.toHaveBeenCalled();
    act(() => {
      onClick();
    });
    expect(props.onClickTakePicture).toHaveBeenCalled();

    unmount();
  });

  it('should display the current recording time properly formatted when recording or recording paused', () => {
    const props = createProps();
    const { rerender, unmount } = render(
      <VideoCaptureRecording {...props} isRecording={true} isRecordingPaused={false} />,
    );

    expect(screen.queryByText('01:15')).not.toBeNull();
    rerender(<VideoCaptureRecording {...props} isRecording={false} isRecordingPaused={true} />);
    expect(screen.queryByText('01:15')).not.toBeNull();

    unmount();
  });

  it('should not display the current recording time when not recording', () => {
    const props = createProps();
    const { unmount } = render(
      <VideoCaptureRecording {...props} isRecording={false} isRecordingPaused={false} />,
    );

    expect(screen.queryByText('01:15')).toBeNull();

    unmount();
  });
});
