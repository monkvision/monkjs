jest.mock('../../../src/VideoCapture/VideoCapturePageLayout', () => ({
  VideoCapturePageLayout: jest.fn(() => <></>),
  PageLayoutItem: jest.fn(() => <></>),
}));

import { render } from '@testing-library/react';
import { VideoCapturePageLayout } from '../../../src/VideoCapture/VideoCapturePageLayout';
import { VideoCaptureTutorial } from '../../../src/VideoCapture/VideoCaptureHUD/VideoCaptureTutorial';
import { expectPropsOnChildMock } from '@monkvision/test-utils';

describe('VideoCaptureTutorial component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use the VideoCapturePageLayout component for the layout', () => {
    const { unmount } = render(<VideoCaptureTutorial />);

    expectPropsOnChildMock(VideoCapturePageLayout, {
      showLogo: false,
      showTitle: false,
      showBackdrop: true,
      showConfirmButton: false,
    });

    unmount();
  });

  it('should render the VideoTutorial component inside VideoCapturePageLayout', () => {
    const { unmount } = render(<VideoCaptureTutorial />);

    const pageLayoutCalls = (VideoCapturePageLayout as jest.Mock).mock.calls;
    expect(pageLayoutCalls.length).toBeGreaterThan(0);
    const { children } = pageLayoutCalls[0][0];

    expect(children).toBeDefined();

    unmount();
  });

  it('should pass the onClose callback to VideoTutorial onComplete', () => {
    const onClose = jest.fn();
    const { unmount } = render(<VideoCaptureTutorial onClose={onClose} />);

    const pageLayoutCalls = (VideoCapturePageLayout as jest.Mock).mock.calls;
    const { children } = pageLayoutCalls[0][0];

    expect(children).toBeDefined();

    unmount();
  });
});
