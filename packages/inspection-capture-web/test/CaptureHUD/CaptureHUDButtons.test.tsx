const GALLERY_BTN_TEST_ID = 'monk-gallery-btn';
const TAKE_PICTURE_BTN_TEST_ID = 'monk-take-picture-btn';
const CLOSE_BTN_TEST_ID = 'monk-close-btn';
const getIconTestId = (icon: string) => `monk-icon-${icon}-test-id`;

const TakePictureButtonMock = jest.fn(() => <div data-testid={TAKE_PICTURE_BTN_TEST_ID}></div>);
const IconMock = jest.fn(({ icon }: { icon: string }) => (
  <div data-testid={getIconTestId(icon)}></div>
));
const interactiveColorValueMock = '#654321';
const interactiveColorEventsMock = {};
const useInteractiveColorMock = jest.fn(() => ({
  color: interactiveColorValueMock,
  events: interactiveColorEventsMock,
}));

jest.mock('@monkvision/common-ui-web', () => ({
  TakePictureButton: TakePictureButtonMock,
  Icon: IconMock,
  useInteractiveColor: useInteractiveColorMock,
}));

import { MonkPicture } from '@monkvision/camera-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { fireEvent, render, screen } from '@testing-library/react';
import { CaptureHUDButtons } from '../../src';

describe('CaptureHUDButtons component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display 3 buttons : open gallery, take picture and close', () => {
    const { unmount } = render(<CaptureHUDButtons />);

    expect(screen.queryByTestId(GALLERY_BTN_TEST_ID)).toBeDefined();
    expect(screen.queryByTestId(TAKE_PICTURE_BTN_TEST_ID)).toBeDefined();
    expect(screen.queryByTestId(CLOSE_BTN_TEST_ID)).toBeDefined();

    unmount();
  });

  describe('Gallery button', () => {
    it('should not be disabled by default', () => {
      const { unmount } = render(<CaptureHUDButtons />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      expect(galleryBtnEl.getAttribute('disabled')).toBeNull();

      unmount();
    });

    it('should be disabled when the galleryDisabled prop is true', () => {
      const { unmount } = render(<CaptureHUDButtons galleryDisabled={true} />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      expect(galleryBtnEl.getAttribute('disabled')).toBeDefined();

      unmount();
    });

    it('should have the disabled class when disabled', () => {
      const { unmount } = render(<CaptureHUDButtons galleryDisabled={true} />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      expect(galleryBtnEl.className).toContain('disabled');

      unmount();
    });

    it('should get passed the onOpenGallery callback', () => {
      const onOpenGallery = jest.fn();
      const { unmount } = render(<CaptureHUDButtons onOpenGallery={onOpenGallery} />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      fireEvent.click(galleryBtnEl);
      expect(onOpenGallery).toHaveBeenCalled();

      unmount();
    });

    it('should display an image icon when no galleryPreview is provided', () => {
      const expectedIcon = 'image';
      const { unmount } = render(<CaptureHUDButtons />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      expect(galleryBtnEl.querySelector(`[data-testid='${getIconTestId('image')}']`)).toBeDefined();
      expect(IconMock.mock.calls).toContainEqual([
        {
          icon: expectedIcon,
          size: 30,
          primaryColor: interactiveColorValueMock,
        },
        expect.anything(),
      ]);

      unmount();
    });

    it('should display background image the galleryPreview prop is provided', () => {
      const galleryPreview = { uri: 'test-uri' } as unknown as MonkPicture;
      const { unmount } = render(<CaptureHUDButtons galleryPreview={galleryPreview} />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      const backgroundDiv = galleryBtnEl.querySelector('div');
      expect(backgroundDiv).toBeDefined();
      expect(backgroundDiv?.style.backgroundImage).toEqual(`url(${galleryPreview.uri})`);

      unmount();
    });
  });

  describe('Take Picture Button button', () => {
    it('should not be disabled by default', () => {
      const { unmount } = render(<CaptureHUDButtons />);

      expectPropsOnChildMock(TakePictureButtonMock, { disabled: false });

      unmount();
    });

    it('should be disabled when the takePictureDisabled prop is true', () => {
      const { unmount } = render(<CaptureHUDButtons takePictureDisabled={true} />);

      expectPropsOnChildMock(TakePictureButtonMock, { disabled: true });

      unmount();
    });

    it('should have a size of 85px', () => {
      const { unmount } = render(<CaptureHUDButtons />);

      expectPropsOnChildMock(TakePictureButtonMock, { size: 85 });

      unmount();
    });

    it('should get passed the onTakePicture callback', () => {
      const onTakePicture = jest.fn();
      const { unmount } = render(<CaptureHUDButtons onTakePicture={onTakePicture} />);

      expectPropsOnChildMock(TakePictureButtonMock, { onClick: onTakePicture });

      unmount();
    });
  });

  describe('Close button', () => {
    it('should not be disabled by default', () => {
      const { unmount } = render(<CaptureHUDButtons />);

      const galleryBtnEl = screen.getByTestId(CLOSE_BTN_TEST_ID);
      expect(galleryBtnEl.getAttribute('disabled')).toBeNull();

      unmount();
    });

    it('should be disabled when the closeDisabled prop is true', () => {
      const { unmount } = render(<CaptureHUDButtons closeDisabled={true} />);

      const galleryBtnEl = screen.getByTestId(CLOSE_BTN_TEST_ID);
      expect(galleryBtnEl.getAttribute('disabled')).toBeDefined();

      unmount();
    });

    it('should have the disabled class when disabled', () => {
      const { unmount } = render(<CaptureHUDButtons closeDisabled={true} />);

      const galleryBtnEl = screen.getByTestId(CLOSE_BTN_TEST_ID);
      expect(galleryBtnEl.className).toContain('disabled');

      unmount();
    });

    it('should get passed the onClose callback', () => {
      const onClose = jest.fn();
      const { unmount } = render(<CaptureHUDButtons onClose={onClose} />);

      const galleryBtnEl = screen.getByTestId(CLOSE_BTN_TEST_ID);
      fireEvent.click(galleryBtnEl);
      expect(onClose).toHaveBeenCalled();

      unmount();
    });

    it('should display an image icon', () => {
      const expectedIcon = 'close';
      const { unmount } = render(<CaptureHUDButtons />);

      const galleryBtnEl = screen.getByTestId(CLOSE_BTN_TEST_ID);
      expect(galleryBtnEl.querySelector(`[data-testid='${getIconTestId('close')}']`)).toBeDefined();
      expect(IconMock.mock.calls).toContainEqual([
        {
          icon: expectedIcon,
          size: 30,
          primaryColor: interactiveColorValueMock,
        },
        expect.anything(),
      ]);

      unmount();
    });
  });
});
