jest.mock('../../../src/VideoCapture/VideoCapturePageLayout', () => ({
  VideoCapturePageLayout: jest.fn(() => <></>),
  PageLayoutItem: jest.fn(() => <></>),
}));

import { render } from '@testing-library/react';
import {
  PageLayoutItem,
  VideoCapturePageLayout,
} from '../../../src/VideoCapture/VideoCapturePageLayout';
import { VideoCaptureTutorial } from '../../../src/VideoCapture/VideoCaptureHUD/VideoCaptureTutorial';
import { expectPropsOnChildMock } from '@monkvision/test-utils';

describe('VideoCaptureTutorial component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use the VideoCapturePageLayout component for the layout', () => {
    const { unmount } = render(<VideoCaptureTutorial />);

    expectPropsOnChildMock(VideoCapturePageLayout, { showBackdrop: true });

    unmount();
  });

  it('should pass the onClose callback to the confirm button', () => {
    const onClose = jest.fn();
    const { unmount } = render(<VideoCaptureTutorial onClose={onClose} />);

    expectPropsOnChildMock(VideoCapturePageLayout, {
      confirmButtonProps: { children: 'video.tutorial.confirm', onClick: expect.any(Function) },
    });
    const { onClick } = (VideoCapturePageLayout as jest.Mock).mock.calls[0][0].confirmButtonProps;
    expect(onClose).not.toHaveBeenCalled();
    onClick();
    expect(onClose).toHaveBeenCalled();

    unmount();
  });

  it('should display one item per tutorial step', () => {
    const { unmount } = render(<VideoCaptureTutorial />);
    unmount();

    expect(PageLayoutItem).not.toHaveBeenCalled();
    const { children } = (VideoCapturePageLayout as jest.Mock).mock.calls[0][0];
    const { unmount: unmount2 } = render(children);
    [
      {
        icon: 'car-arrow',
        title: 'video.tutorial.start.title',
        description: 'video.tutorial.start.description',
      },
      {
        icon: '360',
        title: 'video.tutorial.finish.title',
        description: 'video.tutorial.finish.description',
      },
      {
        icon: 'circle-dot',
        title: 'video.tutorial.photos.title',
        description: 'video.tutorial.photos.description',
      },
    ].forEach(({ icon, title, description }) => {
      expectPropsOnChildMock(PageLayoutItem, {
        icon,
        title,
        description,
      });
    });

    unmount2();
  });
});
