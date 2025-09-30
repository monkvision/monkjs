import { LoadingState } from '@monkvision/common';

jest.mock('../../src/VideoCapture/VideoCapturePageLayout', () => ({
  VideoCapturePageLayout: jest.fn(({ children }) => <>{children}</>),
}));

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import {
  VideoCaptureProcessing,
  VideoCaptureProcessingProps,
} from '../../src/VideoCapture/VideoCaptureProcessing';
import { VideoCapturePageLayout } from '../../src/VideoCapture/VideoCapturePageLayout';

function createProps(): VideoCaptureProcessingProps {
  return {
    inspectionId: 'test-id',
    processedFrames: 123,
    totalProcessingFrames: 456,
    uploadedFrames: 345,
    totalUploadingFrames: 567,
    loading: { isLoading: false, error: undefined } as LoadingState,
    onComplete: jest.fn(),
  };
}

const PROGRESS_BAR_TEST_ID = 'progress-bar';

describe('VideoCaptureProcessing component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the processing progress as a progress bar', () => {
    const props = createProps();
    const progress = props.processedFrames / props.totalProcessingFrames;
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expect(screen.getByTestId(PROGRESS_BAR_TEST_ID)).toHaveStyle({
      width: `${progress * 100}%`,
    });

    unmount();
  });

  it('should display the uploading progress as a progress bar when the processing is completed', () => {
    const props = createProps();
    props.processedFrames = 1;
    props.totalProcessingFrames = 1;
    const progress = props.uploadedFrames / props.totalUploadingFrames;
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expect(screen.getByTestId(PROGRESS_BAR_TEST_ID)).toHaveStyle({
      width: `${progress * 100}%`,
    });

    unmount();
  });

  it('should display the correct labels for the processing progress', () => {
    const props = createProps();
    const progress = props.processedFrames / props.totalProcessingFrames;
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expect(screen.queryByText(`${Math.floor(progress * 100)}%`)).not.toBeNull();
    expect(screen.queryByText('video.processing.processing')).not.toBeNull();

    unmount();
  });

  it('should display the correct labels for the uploading progress', () => {
    const props = createProps();
    props.processedFrames = 1;
    props.totalProcessingFrames = 1;
    const progress = props.uploadedFrames / props.totalUploadingFrames;
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expect(screen.queryByText(`${Math.floor(progress * 100)}%`)).not.toBeNull();
    expect(screen.queryByText('video.processing.uploading')).not.toBeNull();

    unmount();
  });

  it('should display the correct labels when the processing and uploading are completed', () => {
    const props = createProps();
    props.processedFrames = 1;
    props.totalProcessingFrames = 1;
    props.uploadedFrames = 1;
    props.totalUploadingFrames = 1;
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expect(screen.queryByText('100%')).not.toBeNull();
    expect(screen.queryByText('video.processing.success')).not.toBeNull();

    unmount();
  });

  it('should display an error message when the loading state is in error', () => {
    const props = createProps();
    props.processedFrames = 1;
    props.totalProcessingFrames = 1;
    props.uploadedFrames = 1;
    props.totalUploadingFrames = 1;
    props.loading.error = 'test error';
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expect(screen.queryByText(`video.processing.error ${props.inspectionId}`)).not.toBeNull();

    unmount();
  });

  it('should call the onComplete callback when clicking on the done button', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expectPropsOnChildMock(VideoCapturePageLayout, {
      confirmButtonProps: expect.objectContaining({ onClick: expect.any(Function) }),
    });
    const { onClick } = (VideoCapturePageLayout as jest.Mock).mock.calls[0][0].confirmButtonProps;
    expect(props.onComplete).not.toHaveBeenCalled();
    onClick();
    expect(props.onComplete).toHaveBeenCalled();

    unmount();
  });

  it('should pass the proper label to the done button', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expectPropsOnChildMock(VideoCapturePageLayout, {
      confirmButtonProps: expect.objectContaining({ children: 'video.processing.done' }),
    });

    unmount();
  });

  it('should disable the done button when the processing is not completed', () => {
    const props = createProps();
    props.uploadedFrames = 1;
    props.totalUploadingFrames = 1;
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expectPropsOnChildMock(VideoCapturePageLayout, {
      confirmButtonProps: expect.objectContaining({ disabled: true }),
    });

    unmount();
  });

  it('should disable the done button when the uploading is not completed', () => {
    const props = createProps();
    props.processedFrames = 1;
    props.totalProcessingFrames = 1;
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expectPropsOnChildMock(VideoCapturePageLayout, {
      confirmButtonProps: expect.objectContaining({ disabled: true }),
    });

    unmount();
  });

  it('should disable the done button when the loadingstate is in error', () => {
    const props = createProps();
    props.processedFrames = 1;
    props.totalProcessingFrames = 1;
    props.uploadedFrames = 1;
    props.totalUploadingFrames = 1;
    props.loading.error = { test: 'error' };
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expectPropsOnChildMock(VideoCapturePageLayout, {
      confirmButtonProps: expect.objectContaining({ disabled: true }),
    });

    unmount();
  });

  it('should not disable the done button when the processing and uploading are completed', () => {
    const props = createProps();
    props.processedFrames = 1;
    props.totalProcessingFrames = 1;
    props.uploadedFrames = 1;
    props.totalUploadingFrames = 1;
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expectPropsOnChildMock(VideoCapturePageLayout, {
      confirmButtonProps: expect.objectContaining({ disabled: false }),
    });

    unmount();
  });

  it('should set the done button in loading mode when the loading state is loading', () => {
    const props = createProps();
    props.processedFrames = 1;
    props.totalProcessingFrames = 1;
    props.uploadedFrames = 1;
    props.totalUploadingFrames = 1;
    props.loading.isLoading = true;
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expectPropsOnChildMock(VideoCapturePageLayout, {
      confirmButtonProps: expect.objectContaining({ loading: true }),
    });

    unmount();
  });

  it('should not set the done button in loading mode when the loading state is not loading', () => {
    const props = createProps();
    props.processedFrames = 1;
    props.totalProcessingFrames = 1;
    props.uploadedFrames = 1;
    props.totalUploadingFrames = 1;
    props.loading.isLoading = false;
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expectPropsOnChildMock(VideoCapturePageLayout, {
      confirmButtonProps: expect.objectContaining({ loading: false }),
    });

    unmount();
  });

  it('should not show the page layout title', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expectPropsOnChildMock(VideoCapturePageLayout, { showTitle: false });

    unmount();
  });

  it('should show the page layout backdrop', () => {
    const props = createProps();
    const { unmount } = render(<VideoCaptureProcessing {...props} />);

    expectPropsOnChildMock(VideoCapturePageLayout, { showBackdrop: true });

    unmount();
  });
});
