jest.mock('../../../src/components/Button', () => ({
  Button: jest.fn(() => <></>),
}));
jest.mock('../../../src/components/ImageDetailedView/ImageDetailedViewOverlay', () => ({
  ImageDetailedViewOverlay: jest.fn(() => <></>),
}));
jest.mock('../../../src/components/ImageDetailedView/SidePanel', () => ({
  SidePanel: jest.fn(() => <></>),
}));

import { render } from '@testing-library/react';
import { Image, ImageStatus, Viewpoint } from '@monkvision/types';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button, ImageDetailedView, ImageDetailedViewProps } from '../../../src';
import { ImageDetailedViewOverlay } from '../../../src/components/ImageDetailedView/ImageDetailedViewOverlay';
import { SidePanel } from '../../../src/components/ImageDetailedView/SidePanel';

function createProps(): ImageDetailedViewProps {
  return {
    image: { id: 'img-1', status: ImageStatus.SUCCESS } as Image,
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

  it('should render the SidePanel component', () => {
    const props = createProps();
    const { unmount } = render(<ImageDetailedView {...props} />);

    expect(SidePanel).toHaveBeenCalled();

    unmount();
  });

  it('should pass selectedImage to the overlay', () => {
    const props = createProps();
    const { unmount } = render(<ImageDetailedView {...props} />);

    expectPropsOnChildMock(ImageDetailedViewOverlay, {
      image: props.image,
    });

    unmount();
  });

  it('should pass beauty shot props to the overlay when view is set', () => {
    const props = createProps();
    (props as any).view = { id: 'view-1' } as Viewpoint;
    const { unmount } = render(<ImageDetailedView {...props} />);

    expectPropsOnChildMock(ImageDetailedViewOverlay, {
      image: props.image,
      view: (props as any).view,
      isSelectingAlternative: expect.any(Boolean),
      showThumbnail: expect.any(Boolean),
      showSuccessMessage: expect.any(Boolean),
      hasValidatedOnce: expect.any(Boolean),
      captureMode: props.captureMode,
    });

    unmount();
  });
});
