import {
  ImageDetailedViewOverlayProps,
  isImageValid,
  useRetakeOverlay,
  useImageLabelIcon,
} from '../../../../src/components/ImageDetailedView/ImageDetailedViewOverlay/hooks';
import { ComplianceIssue, Image, ImageStatus } from '@monkvision/types';
import { renderHook } from '@testing-library/react-hooks';
import {
  changeAlpha,
  complianceIssueLabels,
  imageStatusLabels,
  useMonkTheme,
  useObjectTranslation,
} from '@monkvision/common';

describe('ImageDetailedViewOverlay hooks', () => {
  describe('isImageValid util function', () => {
    it('should return true if not in captureMode', () => {
      expect(
        isImageValid({
          captureMode: false,
          image: { status: ImageStatus.NOT_COMPLIANT } as Image,
        }),
      ).toEqual(true);
    });

    [
      { status: ImageStatus.SUCCESS, value: true },
      { status: ImageStatus.UPLOADING, value: true },
      { status: ImageStatus.COMPLIANCE_RUNNING, value: true },
      { status: ImageStatus.NOT_COMPLIANT, value: false },
      { status: ImageStatus.UPLOAD_FAILED, value: false },
    ].forEach(({ status, value }) => {
      it(`should return ${value} in captureMode if the image has the ${status} status`, () => {
        expect(
          isImageValid({
            captureMode: true,
            image: { status } as Image,
          }),
        ).toEqual(value);
      });
    });
  });

  describe('useRetakeOverlay hook', () => {
    it('should return the proper properties if the image is valid', () => {
      const tObj = jest.fn((obj) => {
        if (obj === imageStatusLabels[ImageStatus.SUCCESS].title) {
          return 'success-title';
        }
        if (obj === imageStatusLabels[ImageStatus.SUCCESS].description) {
          return 'success-description';
        }
        return null;
      });
      (useObjectTranslation as jest.Mock).mockImplementation(() => ({ tObj }));
      const { result, unmount } = renderHook(useRetakeOverlay, {
        initialProps: { captureMode: false } as ImageDetailedViewOverlayProps,
      });

      expect(result.current).toEqual({
        title: 'success-title',
        description: 'success-description',
        iconColor: 'text-secondary',
        icon: 'check-circle',
        buttonColor: 'primary',
      });

      unmount();
    });

    it('should return the proper properties when the image upload failed', () => {
      const tObj = jest.fn((obj) => {
        if (obj === imageStatusLabels[ImageStatus.UPLOAD_FAILED].title) {
          return 'upload-failed-title';
        }
        if (obj === imageStatusLabels[ImageStatus.UPLOAD_FAILED].description) {
          return 'upload-failed-description';
        }
        return null;
      });
      (useObjectTranslation as jest.Mock).mockImplementation(() => ({ tObj }));
      const { result, unmount } = renderHook(useRetakeOverlay, {
        initialProps: {
          captureMode: true,
          image: { status: ImageStatus.UPLOAD_FAILED },
        } as ImageDetailedViewOverlayProps,
      });

      expect(result.current).toEqual({
        title: 'upload-failed-title',
        description: 'upload-failed-description',
        iconColor: 'alert',
        icon: 'error',
        buttonColor: 'alert',
      });

      unmount();
    });

    it('should return the proper properties if there are no compliance issues in the image', () => {
      const tObj = jest.fn((obj) => {
        if (obj === imageStatusLabels[ImageStatus.SUCCESS].title) {
          return 'success-title';
        }
        if (obj === imageStatusLabels[ImageStatus.SUCCESS].description) {
          return 'success-description';
        }
        return null;
      });
      (useObjectTranslation as jest.Mock).mockImplementation(() => ({ tObj }));
      const { result, unmount } = renderHook(useRetakeOverlay, {
        initialProps: {
          captureMode: true,
          image: { status: ImageStatus.NOT_COMPLIANT, complianceIssues: [] },
        } as unknown as ImageDetailedViewOverlayProps,
      });

      expect(result.current).toEqual({
        title: 'success-title',
        description: 'success-description',
        iconColor: 'text-secondary',
        icon: 'check-circle',
        buttonColor: 'primary',
      });

      unmount();
    });

    it('should return the proper properties when the image is not compliant', () => {
      const image = {
        status: ImageStatus.NOT_COMPLIANT,
        complianceIssues: [ComplianceIssue.WETNESS, ComplianceIssue.UNDEREXPOSURE],
      };
      const tObj = jest.fn((obj) => {
        if (obj === complianceIssueLabels[image.complianceIssues[0]].title) {
          return 'expected-title';
        }
        if (obj === complianceIssueLabels[image.complianceIssues[0]].description) {
          return 'expected-description';
        }
        return null;
      });
      (useObjectTranslation as jest.Mock).mockImplementation(() => ({ tObj }));
      const { result, unmount } = renderHook(useRetakeOverlay, {
        initialProps: { captureMode: true, image } as unknown as ImageDetailedViewOverlayProps,
      });

      expect(result.current).toEqual({
        title: 'expected-title',
        description: 'expected-description',
        iconColor: 'alert',
        icon: 'error',
        buttonColor: 'alert',
      });

      unmount();
    });
  });

  describe('useImageLabelIcon hook', () => {
    it('should return null if not in captureMode', () => {
      const { result, unmount } = renderHook(useImageLabelIcon, {
        initialProps: { captureMode: false } as ImageDetailedViewOverlayProps,
      });

      expect(result.current).toBeNull();
      unmount();
    });

    (changeAlpha as jest.Mock).mockImplementation((value, alpha) => `${value}-${alpha}`);
    (useMonkTheme as jest.Mock).mockImplementation(() => ({
      palette: { text: { black: 'text-black' } },
    }));
    [
      { status: ImageStatus.UPLOADING, icon: 'processing', primaryColor: 'text-black-0.5' },
      {
        status: ImageStatus.COMPLIANCE_RUNNING,
        icon: 'processing',
        primaryColor: 'text-black-0.5',
      },
      { status: ImageStatus.SUCCESS, icon: 'check-circle', primaryColor: 'text-black' },
      { status: ImageStatus.UPLOAD_FAILED, icon: 'error', primaryColor: 'alert' },
      { status: ImageStatus.NOT_COMPLIANT, icon: 'error', primaryColor: 'alert' },
    ].forEach(({ status, icon, primaryColor }) => {
      it(`should return the proper icon for the ${status} status`, () => {
        const { result, unmount } = renderHook(useImageLabelIcon, {
          initialProps: { captureMode: true, image: { status } } as ImageDetailedViewOverlayProps,
        });

        expect(result.current?.icon).toEqual(icon);
        expect(result.current?.primaryColor).toEqual(primaryColor);
        unmount();
      });
    });
  });
});
