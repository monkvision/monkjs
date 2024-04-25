import {
  ImageDetailedViewOverlayProps,
  isComplianceContainerDisplayed,
  useComplianceLabels,
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
  describe('isComplianceContainerDisplayed util function', () => {
    it('should return false if not in captureMode', () => {
      expect(
        isComplianceContainerDisplayed({
          captureMode: false,
          image: { status: ImageStatus.NOT_COMPLIANT } as Image,
        }),
      ).toEqual(false);
    });

    [
      { status: ImageStatus.SUCCESS, value: false },
      { status: ImageStatus.UPLOADING, value: false },
      { status: ImageStatus.COMPLIANCE_RUNNING, value: false },
      { status: ImageStatus.NOT_COMPLIANT, value: true },
      { status: ImageStatus.UPLOAD_FAILED, value: true },
    ].forEach(({ status, value }) => {
      it(`should return ${value} in captureMode if the image has the ${status} status`, () => {
        expect(
          isComplianceContainerDisplayed({
            captureMode: true,
            image: { status } as Image,
          }),
        ).toEqual(value);
      });
    });
  });

  describe('useComplianceLabels hook', () => {
    it('should return null if overlay is not displayed', () => {
      const { result, unmount } = renderHook(useComplianceLabels, {
        initialProps: { captureMode: false } as ImageDetailedViewOverlayProps,
      });

      expect(result.current).toBeNull();

      unmount();
    });

    it('should return the proper labels when the image upload failed', () => {
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
      const { result, unmount } = renderHook(useComplianceLabels, {
        initialProps: {
          captureMode: true,
          image: { status: ImageStatus.UPLOAD_FAILED },
        } as ImageDetailedViewOverlayProps,
      });

      expect(result.current?.title).toEqual('upload-failed-title');
      expect(result.current?.description).toEqual('upload-failed-description');

      unmount();
    });

    it('should return null if there are no compliance issues in the image', () => {
      const { result, unmount } = renderHook(useComplianceLabels, {
        initialProps: {
          captureMode: true,
          image: { status: ImageStatus.NOT_COMPLIANT, complianceIssues: [] },
        } as unknown as ImageDetailedViewOverlayProps,
      });

      expect(result.current).toBeNull();

      unmount();
    });

    it('should return the proper labels when the image is not compliant', () => {
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
      const { result, unmount } = renderHook(useComplianceLabels, {
        initialProps: { captureMode: true, image } as unknown as ImageDetailedViewOverlayProps,
      });

      expect(result.current?.title).toEqual('expected-title');
      expect(result.current?.description).toEqual('expected-description');

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
