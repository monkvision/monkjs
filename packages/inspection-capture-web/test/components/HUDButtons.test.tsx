import '@testing-library/jest-dom';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { InteractiveStatus } from '@monkvision/types';
import { TakePictureButton, Icon } from '@monkvision/common-ui-web';
import { fireEvent, render, screen } from '@testing-library/react';
import { HUDButtons } from '../../src/components';
import { captureButtonForegroundColors } from '../../src/components/HUDButtons/HUDButtons.styles';

const GALLERY_BTN_TEST_ID = 'monk-gallery-btn';
const GALLERY_BADGE_TEST_ID = 'monk-gallery-badge';
const CLOSE_BTN_TEST_ID = 'monk-close-btn';

describe('CaptureHUDButtons component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display 3 buttons : open gallery, take picture and close', () => {
    const { unmount } = render(<HUDButtons />);

    expect(Icon).toHaveBeenCalledTimes(2);
    expect(TakePictureButton).toHaveBeenCalledTimes(1);

    unmount();
  });

  describe('Gallery button', () => {
    it('should not be disabled by default', () => {
      const { unmount } = render(<HUDButtons />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      expect(galleryBtnEl.getAttribute('disabled')).toBeNull();

      unmount();
    });

    it('should be disabled when the galleryDisabled prop is true', () => {
      const { unmount } = render(<HUDButtons galleryDisabled={true} />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      expect(galleryBtnEl.getAttribute('disabled')).toBeDefined();

      unmount();
    });

    it('should get passed the onOpenGallery callback', () => {
      const onOpenGallery = jest.fn();
      const { unmount } = render(<HUDButtons onOpenGallery={onOpenGallery} />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      fireEvent.click(galleryBtnEl);
      expect(onOpenGallery).toHaveBeenCalled();

      unmount();
    });

    it('should display a gallery icon when no galleryPreview is provided', () => {
      const { unmount } = render(<HUDButtons />);

      const galleryIconCall = (Icon as jest.Mock).mock.calls.find(
        (call) => call[0]?.icon === 'gallery',
      );

      expect(galleryIconCall).toEqual([
        {
          icon: 'gallery',
          size: 30,
          primaryColor: captureButtonForegroundColors[InteractiveStatus.DEFAULT],
        },
        undefined,
      ]);

      unmount();
    });

    it('should display background image the galleryPreview prop is provided', () => {
      const uri = 'test-uri';
      const { unmount } = render(<HUDButtons galleryPreview={uri} />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      const backgroundDiv = galleryBtnEl.querySelector('div');
      expect(backgroundDiv).toBeDefined();
      expect(backgroundDiv?.style.backgroundImage).toEqual(`url("${uri}")`);

      unmount();
    });

    it('should not display the notification badge if not asked to', () => {
      const { unmount } = render(<HUDButtons showGalleryBadge={false} />);

      const galleryBadgeEl = screen.getByTestId(GALLERY_BADGE_TEST_ID);
      expect(galleryBadgeEl).toHaveStyle({ visibility: 'hidden' });

      unmount();
    });

    it('should display the notification badge if asked to', () => {
      const { unmount } = render(<HUDButtons showGalleryBadge={true} />);

      const galleryBadgeEl = screen.getByTestId(GALLERY_BADGE_TEST_ID);
      expect(galleryBadgeEl).toHaveStyle({ visibility: 'visible' });

      unmount();
    });

    it('should display the notification badge with the number of pictures to retake', () => {
      const { unmount } = render(<HUDButtons showGalleryBadge={true} retakeCount={10} />);

      const galleryBadgeEl = screen.getByTestId(GALLERY_BADGE_TEST_ID);
      expect(galleryBadgeEl.textContent).toBe('10');

      unmount();
    });
  });

  describe('Take Picture Button button', () => {
    const takePictureButtonMock = TakePictureButton as unknown as jest.Mock;

    it('should not be disabled by default', () => {
      const { unmount } = render(<HUDButtons />);

      expectPropsOnChildMock(takePictureButtonMock, { disabled: false });

      unmount();
    });

    it('should be disabled when the takePictureDisabled prop is true', () => {
      const { unmount } = render(<HUDButtons takePictureDisabled={true} />);

      expectPropsOnChildMock(takePictureButtonMock, { disabled: true });

      unmount();
    });

    it('should have a size of 85px', () => {
      const { unmount } = render(<HUDButtons />);

      expectPropsOnChildMock(takePictureButtonMock, { size: 85 });

      unmount();
    });

    it('should get passed the onTakePicture callback', () => {
      const onTakePicture = jest.fn();
      const { unmount } = render(<HUDButtons onTakePicture={onTakePicture} />);

      expectPropsOnChildMock(takePictureButtonMock, { onClick: onTakePicture });

      unmount();
    });
  });

  describe('Close button', () => {
    it('should not be displayed by default', () => {
      const { unmount } = render(<HUDButtons />);

      const closeBtn = screen.getByTestId(CLOSE_BTN_TEST_ID);
      expect(closeBtn).toHaveStyle({ visibility: 'hidden' });

      unmount();
    });

    it('should displayed when showCloseButton is true', () => {
      const { unmount } = render(<HUDButtons showCloseButton />);

      const closeBtn = screen.getByTestId(CLOSE_BTN_TEST_ID);
      expect(closeBtn).toHaveStyle({ visibility: 'visible' });

      unmount();
    });

    it('should not be disabled by default', () => {
      const { unmount } = render(<HUDButtons showCloseButton />);

      const closeBtn = screen.getByTestId(CLOSE_BTN_TEST_ID);
      expect(closeBtn.getAttribute('disabled')).toBeNull();

      unmount();
    });

    it('should be disabled when the closeDisabled prop is true', () => {
      const { unmount } = render(<HUDButtons showCloseButton closeDisabled={true} />);

      const closeBtn = screen.getByTestId(CLOSE_BTN_TEST_ID);
      expect(closeBtn.getAttribute('disabled')).toBeDefined();

      unmount();
    });

    it('should get passed the onClose callback', () => {
      const onClose = jest.fn();
      const { unmount } = render(<HUDButtons showCloseButton onClose={onClose} />);

      const closeBtn = screen.getByTestId(CLOSE_BTN_TEST_ID);
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalled();

      unmount();
    });

    it('should display an image icon', () => {
      const expectedIcon = 'close';
      const { unmount } = render(<HUDButtons showCloseButton />);

      const closeIconCall = (Icon as jest.Mock).mock.calls.find(
        (call) => call[0]?.icon === expectedIcon,
      );

      expect(closeIconCall).toEqual([
        {
          icon: expectedIcon,
          size: 30,
          primaryColor: captureButtonForegroundColors[InteractiveStatus.DEFAULT],
        },
        undefined,
      ]);

      unmount();
    });
  });
});
