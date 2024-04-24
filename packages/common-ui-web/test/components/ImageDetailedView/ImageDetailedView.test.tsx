jest.mock('../../../src/components/Button', () => ({
  Button: jest.fn(() => <></>),
}));
jest.mock('../../../src/components/ImageDetailedView/ImageDetailedViewOverlay', () => ({
  ImageDetailedViewOverlay: jest.fn(() => <></>),
}));

import { render } from '@testing-library/react';
import { Image, ImageStatus } from '@monkvision/types';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button, ImageDetailedView, ImageDetailedViewProps } from '../../../src';
import { ImageDetailedViewOverlay } from '../../../src/components/ImageDetailedView/ImageDetailedViewOverlay';

function createProps(): ImageDetailedViewProps {
  return {
    image: { status: ImageStatus.SUCCESS } as Image,
    lang: 'de',
    showGalleryButton: true,
    onClose: jest.fn(),
    onNavigateToGallery: jest.fn(),
    captureMode: true,
    showCaptureButton: true,
    onNavigateToCapture: jest.fn(),
    onRetake: jest.fn(),
  };
}

describe('ImageDetailedView component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a close button', () => {
    const props = createProps();
    const { unmount } = render(<ImageDetailedView {...props} />);

    expectPropsOnChildMock(Button, {
      icon: 'close',
      onClick: expect.any(Function),
    });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls.find(
      (args) => args[0].icon === 'close',
    )[0];
    expect(props.onClose).not.toHaveBeenCalled();
    onClick();
    expect(props.onClose).toHaveBeenCalled();

    unmount();
  });

  it('should display the detailed view overlay', () => {
    const props = createProps();
    const { unmount } = render(<ImageDetailedView {...props} />);

    expectPropsOnChildMock(ImageDetailedViewOverlay, {
      image: props.image,
      captureMode: props.captureMode,
      onRetake: props.captureMode ? props.onRetake : undefined,
    });

    unmount();
  });

  it('should display a gallery button', () => {
    const props = createProps();
    props.showGalleryButton = true;
    const { unmount } = render(<ImageDetailedView {...props} />);

    expectPropsOnChildMock(Button, {
      icon: 'gallery',
      onClick: expect.any(Function),
    });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls.find(
      (args) => args[0].icon === 'gallery',
    )[0];
    expect(props.onNavigateToGallery).not.toHaveBeenCalled();
    onClick();
    expect(props.onNavigateToGallery).toHaveBeenCalled();

    unmount();
  });

  it('should display a capture button', () => {
    const props = createProps();
    props.captureMode = true;
    (props as any).showCaptureButton = true;
    const { unmount } = render(<ImageDetailedView {...props} />);

    expectPropsOnChildMock(Button, {
      icon: 'camera-outline',
      onClick: expect.any(Function),
    });
    const { onClick } = (Button as unknown as jest.Mock).mock.calls.find(
      (args) => args[0].icon === 'camera-outline',
    )[0];
    expect((props as any).onNavigateToCapture).not.toHaveBeenCalled();
    onClick();
    expect((props as any).onNavigateToCapture).toHaveBeenCalled();

    unmount();
  });
});
