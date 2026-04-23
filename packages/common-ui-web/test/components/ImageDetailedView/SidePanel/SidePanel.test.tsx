jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../../../src/components/Button', () => ({
  Button: jest.fn(({ children, onClick }) => <button onClick={onClick}>{children}</button>),
}));

jest.mock('../../../../src/components/ImageDetailedView/SidePanel/types', () => ({
  ...jest.requireActual('../../../../src/components/ImageDetailedView/SidePanel/types'),
  useSidePanelStyles: jest.fn(() => ({
    thumbnailListStyle: {},
    thumbnailWrapperStyle: {},
    selectedBadgeStyle: {},
    getThumbnailStyle: jest.fn(() => ({})),
  })),
}));

import { render, fireEvent } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Image, Viewpoint } from '@monkvision/types';
import { Button } from '../../../../src/components/Button';
import { SidePanel } from '../../../../src/components/ImageDetailedView/SidePanel/SidePanel';
import { SidePanelProps } from '../../../../src/components/ImageDetailedView/SidePanel/types';

const mockImages: Image[] = [
  { id: 'img-1', path: '/img1.jpg', thumbnailPath: '/thumb1.jpg', sightId: 'sight-1' } as Image,
  { id: 'img-2', path: '/img2.jpg', thumbnailPath: '', sightId: null } as unknown as Image,
];

function createDetailedViewProps() {
  return {
    image: { id: 'main' } as Image,
    captureMode: true,
    showGalleryButton: true,
    showCaptureButton: true,
    onClose: jest.fn(),
    onNavigateToGallery: jest.fn(),
    onNavigateToCapture: jest.fn(),
    onRetake: jest.fn(),
    onValidateAlternative: jest.fn(),
  } as any;
}

function createProps(overrides: Partial<SidePanelProps> = {}): SidePanelProps {
  return {
    hasAlternatives: false,
    showThumbnails: false,
    images: mockImages,
    view: Viewpoint.FRONT,
    hasChanged: false,
    selectedImage: mockImages[0],
    validatedImage: mockImages[0],
    closeButton: { primaryColor: 'close-primary', secondaryColor: 'close-secondary' },
    galleryButton: { primaryColor: 'gallery-primary', secondaryColor: 'gallery-secondary', style: { opacity: 1 } },
    cameraButton: { style: { opacity: 0.5 } },
    selectImage: jest.fn(),
    setShowThumbnails: jest.fn(),
    props: createDetailedViewProps(),
    ...overrides,
  };
}

describe('SidePanel', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render DefaultPanel when hasAlternatives is false', () => {
    const props = createProps({ hasAlternatives: false });
    const { unmount } = render(<SidePanel {...props} />);

    expectPropsOnChildMock(Button, {
      icon: 'gallery',
      primaryColor: 'gallery-primary',
      secondaryColor: 'gallery-secondary',
    });
    expectPropsOnChildMock(Button, { icon: 'camera-outline' });
    unmount();
  });

  it('should render AlternativesPanel when hasAlternatives is true and showThumbnails is false', () => {
    const props = createProps({ hasAlternatives: true, showThumbnails: false });
    const { unmount, getByText } = render(<SidePanel {...props} />);

    expect(getByText('sidepanel.close')).toBeTruthy();
    expect(getByText('sidepanel.retake')).toBeTruthy();
    expect(getByText('sidepanel.browse-shots')).toBeTruthy();
    unmount();
  });

  it('should render ThumbnailsPanel when hasAlternatives is true, showThumbnails is true and view is defined', () => {
    const props = createProps({
      hasAlternatives: true,
      showThumbnails: true,
      view: Viewpoint.FRONT,
    });
    const { unmount, container } = render(<SidePanel {...props} />);

    const images = container.querySelectorAll('img');
    expect(images.length).toBe(mockImages.length);
    unmount();
  });
});

describe('DefaultPanel', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render gallery button with correct props', () => {
    const props = createProps({ hasAlternatives: false });
    const { unmount } = render(<SidePanel {...props} />);

    expectPropsOnChildMock(Button, {
      disabled: false,
      icon: 'gallery',
      primaryColor: 'gallery-primary',
      secondaryColor: 'gallery-secondary',
      style: { opacity: 1 },
    });
    unmount();
  });

  it('should render camera button with correct props', () => {
    const props = createProps({ hasAlternatives: false });
    const { unmount } = render(<SidePanel {...props} />);

    expectPropsOnChildMock(Button, {
      disabled: false,
      icon: 'camera-outline',
      style: { opacity: 0.5 },
    });
    unmount();
  });

  it('should disable gallery button when showGalleryButton is false', () => {
    const detailedProps = createDetailedViewProps();
    detailedProps.showGalleryButton = false;
    const props = createProps({ hasAlternatives: false, props: detailedProps });
    const { unmount } = render(<SidePanel {...props} />);

    expectPropsOnChildMock(Button, { disabled: true, icon: 'gallery' });
    unmount();
  });

  it('should disable camera button when captureMode is false', () => {
    const detailedProps = createDetailedViewProps();
    detailedProps.captureMode = false;
    const props = createProps({ hasAlternatives: false, props: detailedProps });
    const { unmount } = render(<SidePanel {...props} />);

    expectPropsOnChildMock(Button, { disabled: true, icon: 'camera-outline' });
    unmount();
  });

  it('should NOT render camera button for video frames (additionalData present)', () => {
    const detailedProps = createDetailedViewProps();
    detailedProps.image = { id: 'video-frame', additionalData: { frame_index: 5 } } as Image;
    const props = createProps({ hasAlternatives: false, props: detailedProps });
    const { unmount } = render(<SidePanel {...props} />);

    const cameraButtonCalls = (Button as unknown as jest.Mock).mock.calls.filter(
      (args: any[]) => args[0].icon === 'camera-outline',
    );
    expect(cameraButtonCalls.length).toBe(0);

    unmount();
  });

  it('should still render gallery button for video frames', () => {
    const detailedProps = createDetailedViewProps();
    detailedProps.image = { id: 'video-frame', additionalData: { frame_index: 5 } } as Image;
    const props = createProps({ hasAlternatives: false, props: detailedProps });
    const { unmount } = render(<SidePanel {...props} />);

    expectPropsOnChildMock(Button, { icon: 'gallery' });

    unmount();
  });
});

describe('AlternativesPanel', () => {
  afterEach(() => jest.clearAllMocks());

  it('should render close, retake, and browse shots buttons', () => {
    const props = createProps({ hasAlternatives: true, showThumbnails: false });
    const { unmount, getByText } = render(<SidePanel {...props} />);

    expect(getByText('sidepanel.close')).toBeTruthy();
    expect(getByText('sidepanel.retake')).toBeTruthy();
    expect(getByText('sidepanel.browse-shots')).toBeTruthy();
    unmount();
  });

  it('should not render retake button when captureMode is false', () => {
    const detailedProps = createDetailedViewProps();
    detailedProps.captureMode = false;
    const props = createProps({ hasAlternatives: true, showThumbnails: false, props: detailedProps });
    const { unmount, queryByText } = render(<SidePanel {...props} />);

    expect(queryByText('sidepanel.retake')).toBeNull();
    unmount();
  });

  it('should call onClose when close button is clicked', () => {
    const detailedProps = createDetailedViewProps();
    const props = createProps({ hasAlternatives: true, showThumbnails: false, props: detailedProps });
    const { unmount, getByText } = render(<SidePanel {...props} />);

    fireEvent.click(getByText('sidepanel.close'));
    expect(detailedProps.onClose).toHaveBeenCalled();
    unmount();
  });

  it('should call setShowThumbnails(true) when browse shots is clicked', () => {
    const props = createProps({ hasAlternatives: true, showThumbnails: false });
    const { unmount, getByText } = render(<SidePanel {...props} />);

    fireEvent.click(getByText('sidepanel.browse-shots'));
    expect(props.setShowThumbnails).toHaveBeenCalledWith(true);
    unmount();
  });
});

describe('ThumbnailsPanel', () => {
  afterEach(() => jest.clearAllMocks());

  function renderThumbnails(overrides: Partial<SidePanelProps> = {}) {
    const props = createProps({
      hasAlternatives: true,
      showThumbnails: true,
      view: Viewpoint.FRONT,
      ...overrides,
    });
    return { ...render(<SidePanel {...props} />), props };
  }

  it('should render null when images array is empty', () => {
    const { container, unmount } = renderThumbnails({ images: [] });

    expect(container.innerHTML).toBe('');
    unmount();
  });

  it('should render thumbnails with correct src using thumbnailPath when available', () => {
    const { container, unmount } = renderThumbnails();

    const images = container.querySelectorAll('img');
    expect(images[0].getAttribute('src')).toBe('/thumb1.jpg');
    unmount();
  });

  it('should fall back to path when thumbnailPath is empty', () => {
    const { container, unmount } = renderThumbnails();

    const images = container.querySelectorAll('img');
    expect(images[1].getAttribute('src')).toBe('/img2.jpg');
    unmount();
  });

  it('should render thumbnails with sightId as alt text', () => {
    const { container, unmount } = renderThumbnails();

    const images = container.querySelectorAll('img');
    expect(images[0].getAttribute('alt')).toBe('sight-1');
    unmount();
  });

  it('should call selectImage when a thumbnail is clicked', () => {
    const selectImage = jest.fn();
    const { container, unmount } = renderThumbnails({ selectImage });

    const images = container.querySelectorAll('img');
    fireEvent.click(images[1]);
    expect(selectImage).toHaveBeenCalledWith(1);
    unmount();
  });

  it('should call selectImage on Enter keydown', () => {
    const selectImage = jest.fn();
    const { container, unmount } = renderThumbnails({ selectImage });

    const images = container.querySelectorAll('img');
    fireEvent.keyDown(images[0], { key: 'Enter' });
    expect(selectImage).toHaveBeenCalledWith(0);
    unmount();
  });

  it('should call selectImage on Space keydown', () => {
    const selectImage = jest.fn();
    const { container, unmount } = renderThumbnails({ selectImage });

    const images = container.querySelectorAll('img');
    fireEvent.keyDown(images[0], { key: ' ' });
    expect(selectImage).toHaveBeenCalledWith(0);
    unmount();
  });

  it('should show ✓ badge on the validated image', () => {
    const { container, unmount } = renderThumbnails({ validatedImage: mockImages[0] });

    const badge = container.querySelector('div > div > div');
    expect(badge?.textContent).toBe('✓');
    unmount();
  });

  it('should not show ✓ badge on non-validated images', () => {
    const nonValidated = { id: 'other', path: '/other.jpg', thumbnailPath: '/other-thumb.jpg' } as Image;
    const { container, unmount } = renderThumbnails({ validatedImage: nonValidated });

    expect(container.textContent).not.toContain('✓');
    unmount();
  });

  it('should render action button with check-circle icon when hasChanged is true', () => {
    const { unmount } = renderThumbnails({ hasChanged: true });

    expectPropsOnChildMock(Button, {
      icon: 'check-circle',
      primaryColor: 'primary-base',
    });
    unmount();
  });

  it('should render action button with close icon when hasChanged is false', () => {
    const { unmount } = renderThumbnails({ hasChanged: false });

    expectPropsOnChildMock(Button, {
      icon: 'close',
      primaryColor: 'secondary-base',
    });
    unmount();
  });

  it('should call onValidateAlternative when hasChanged and action button is clicked', () => {
    const detailedProps = createDetailedViewProps();
    const { container, unmount } = renderThumbnails({
      hasChanged: true,
      props: detailedProps,
      selectedImage: mockImages[0],
      view: Viewpoint.FRONT,
    });

    const buttons = container.querySelectorAll('button');
    const actionButton = buttons[buttons.length - 1];
    fireEvent.click(actionButton);

    expect(detailedProps.onValidateAlternative).toHaveBeenCalledWith(mockImages[0], Viewpoint.FRONT);
    unmount();
  });

  it('should call setShowThumbnails(false) when !hasChanged and action button is clicked', () => {
    const setShowThumbnails = jest.fn();
    const { container, unmount } = renderThumbnails({
      hasChanged: false,
      setShowThumbnails,
    });

    const buttons = container.querySelectorAll('button');
    const actionButton = buttons[buttons.length - 1];
    fireEvent.click(actionButton);

    expect(setShowThumbnails).toHaveBeenCalledWith(false);
    unmount();
  });
});
