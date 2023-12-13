jest.mock('@monkvision/common-ui-web');
jest.mock('@monkvision/common');

import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { InteractiveStatus } from '@monkvision/types';
import { MonkPicture } from '@monkvision/camera-web';
import { TakePictureButton, Icon } from '@monkvision/common-ui-web';
import { fireEvent, render, screen } from '@testing-library/react';
import { PhotoCaptureHUDButtons } from '../../src';
import { captureButtonForegroundColors } from '../../src/PhotoCaptureHUD/PhotoCaptureHUDButtons/CaptureHUDButtons.styles';

const GALLERY_BTN_TEST_ID = 'monk-gallery-btn';
const CLOSE_BTN_TEST_ID = 'monk-close-btn';

describe('CaptureHUDButtons component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display 3 buttons : open gallery, take picture and close', () => {
    const { unmount } = render(<PhotoCaptureHUDButtons />);

    expect(Icon).toHaveBeenCalledTimes(2);
    expect(TakePictureButton).toHaveBeenCalledTimes(1);

    unmount();
  });

  describe('Gallery button', () => {
    it('should not be disabled by default', () => {
      const { unmount } = render(<PhotoCaptureHUDButtons />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      expect(galleryBtnEl.getAttribute('disabled')).toBeNull();

      unmount();
    });

    it('should be disabled when the galleryDisabled prop is true', () => {
      const { unmount } = render(<PhotoCaptureHUDButtons galleryDisabled={true} />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      expect(galleryBtnEl.getAttribute('disabled')).toBeDefined();

      unmount();
    });

    it('should get passed the onOpenGallery callback', () => {
      const onOpenGallery = jest.fn();
      const { unmount } = render(<PhotoCaptureHUDButtons onOpenGallery={onOpenGallery} />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      fireEvent.click(galleryBtnEl);
      expect(onOpenGallery).toHaveBeenCalled();

      unmount();
    });

    it('should display an image icon when no galleryPreview is provided', () => {
      const expectedIcon = 'image';
      const { unmount } = render(<PhotoCaptureHUDButtons />);

      expect((Icon as jest.Mock).mock.calls).toContainEqual([
        {
          icon: expectedIcon,
          size: 30,
          primaryColor: captureButtonForegroundColors[InteractiveStatus.DEFAULT],
        },
        expect.anything(),
      ]);

      unmount();
    });

    it('should display background image the galleryPreview prop is provided', () => {
      const galleryPreview = { uri: 'test-uri' } as unknown as MonkPicture;
      const { unmount } = render(<PhotoCaptureHUDButtons galleryPreview={galleryPreview} />);

      const galleryBtnEl = screen.getByTestId(GALLERY_BTN_TEST_ID);
      const backgroundDiv = galleryBtnEl.querySelector('div');
      expect(backgroundDiv).toBeDefined();
      expect(backgroundDiv?.style.backgroundImage).toEqual(`url(${galleryPreview.uri})`);

      unmount();
    });
  });

  describe('Take Picture Button button', () => {
    const takePictureButtonMock = TakePictureButton as unknown as jest.Mock;

    it('should not be disabled by default', () => {
      const { unmount } = render(<PhotoCaptureHUDButtons />);

      expectPropsOnChildMock(takePictureButtonMock, { disabled: false });

      unmount();
    });

    it('should be disabled when the takePictureDisabled prop is true', () => {
      const { unmount } = render(<PhotoCaptureHUDButtons takePictureDisabled={true} />);

      expectPropsOnChildMock(takePictureButtonMock, { disabled: true });

      unmount();
    });

    it('should have a size of 85px', () => {
      const { unmount } = render(<PhotoCaptureHUDButtons />);

      expectPropsOnChildMock(takePictureButtonMock, { size: 85 });

      unmount();
    });

    it('should get passed the onTakePicture callback', () => {
      const onTakePicture = jest.fn();
      const { unmount } = render(<PhotoCaptureHUDButtons onTakePicture={onTakePicture} />);

      expectPropsOnChildMock(takePictureButtonMock, { onClick: onTakePicture });

      unmount();
    });
  });

  describe('Close button', () => {
    it('should not be disabled by default', () => {
      const { unmount } = render(<PhotoCaptureHUDButtons />);

      const galleryBtnEl = screen.getByTestId(CLOSE_BTN_TEST_ID);
      expect(galleryBtnEl.getAttribute('disabled')).toBeNull();

      unmount();
    });

    it('should be disabled when the closeDisabled prop is true', () => {
      const { unmount } = render(<PhotoCaptureHUDButtons closeDisabled={true} />);

      const galleryBtnEl = screen.getByTestId(CLOSE_BTN_TEST_ID);
      expect(galleryBtnEl.getAttribute('disabled')).toBeDefined();

      unmount();
    });

    it('should get passed the onClose callback', () => {
      const onClose = jest.fn();
      const { unmount } = render(<PhotoCaptureHUDButtons onClose={onClose} />);

      const galleryBtnEl = screen.getByTestId(CLOSE_BTN_TEST_ID);
      fireEvent.click(galleryBtnEl);
      expect(onClose).toHaveBeenCalled();

      unmount();
    });

    it('should display an image icon', () => {
      const expectedIcon = 'close';
      const { unmount } = render(<PhotoCaptureHUDButtons />);

      expect((Icon as jest.Mock).mock.calls).toContainEqual([
        {
          icon: expectedIcon,
          size: 30,
          primaryColor: captureButtonForegroundColors[InteractiveStatus.DEFAULT],
        },
        expect.anything(),
      ]);

      unmount();
    });
  });
});
