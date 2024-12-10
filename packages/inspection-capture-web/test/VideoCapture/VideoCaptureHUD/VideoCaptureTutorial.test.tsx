jest.mock('../../../src/VideoCapture/VideoCaptureIntroLayout', () => ({
  VideoCaptureIntroLayout: jest.fn(() => <></>),
  IntroLayoutItem: jest.fn(() => <></>),
}));

import { render } from '@testing-library/react';
import {
  IntroLayoutItem,
  VideoCaptureIntroLayout,
} from '../../../src/VideoCapture/VideoCaptureIntroLayout';
import { VideoCaptureTutorial } from '../../../src/VideoCapture/VideoCaptureHUD/VideoCaptureTutorial';
import { expectPropsOnChildMock } from '@monkvision/test-utils';

describe('VideoCaptureTutorial component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use the VideoCaptureIntroLayout component for the layout', () => {
    const { unmount } = render(<VideoCaptureTutorial />);

    expectPropsOnChildMock(VideoCaptureIntroLayout, { showBackdrop: true });

    unmount();
  });

  it('should pass the onClose callback to the confirm button', () => {
    const onClose = jest.fn();
    const { unmount } = render(<VideoCaptureTutorial onClose={onClose} />);

    expectPropsOnChildMock(VideoCaptureIntroLayout, {
      confirmButtonProps: { children: 'video.tutorial.confirm', onClick: expect.any(Function) },
    });
    const { onClick } = (VideoCaptureIntroLayout as jest.Mock).mock.calls[0][0].confirmButtonProps;
    expect(onClose).not.toHaveBeenCalled();
    onClick();
    expect(onClose).toHaveBeenCalled();

    unmount();
  });

  it('should display one item per tutorial step', () => {
    const { unmount } = render(<VideoCaptureTutorial />);
    unmount();

    expect(IntroLayoutItem).not.toHaveBeenCalled();
    const { children } = (VideoCaptureIntroLayout as jest.Mock).mock.calls[0][0];
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
      expectPropsOnChildMock(IntroLayoutItem, {
        icon,
        title,
        description,
      });
    });

    unmount2();
  });
});
