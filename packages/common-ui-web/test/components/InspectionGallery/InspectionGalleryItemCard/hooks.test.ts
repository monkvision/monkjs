import { renderHook } from '@testing-library/react-hooks';
import { useObjectTranslation, useSightLabel } from '@monkvision/common';
import { labels, sights } from '@monkvision/sights';
import { useTranslation } from 'react-i18next';
import {
  useInspectionGalleryItemLabel,
  useInspectionGalleryItemStatusIconName,
} from '../../../../src/components/InspectionGallery/InspectionGalleryItemCard/hooks';
import { InspectionGalleryItem } from '../../../../src/components/InspectionGallery/types';
import { Image, ImageStatus } from '@monkvision/types';

describe('InspectionGalleryItemCard hooks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useInspectionGalleryItemLabel hook', () => {
    it('should return the proper label for the add damage item', () => {
      const item: InspectionGalleryItem = { isAddDamage: true };
      const { result, unmount } = renderHook(useInspectionGalleryItemLabel, { initialProps: item });

      expect(useTranslation).toHaveBeenCalled();
      const { t } = (useTranslation as jest.Mock).mock.results[0].value;
      expect(t).toHaveBeenCalledWith('card.addDamage');
      expect(result.current).toEqual('card.addDamage');

      unmount();
    });

    it('should return the proper label for an untaken item', () => {
      const expectedLabel = 'hello';
      (useSightLabel as jest.Mock).mockImplementationOnce(() => ({
        label: jest.fn(() => expectedLabel),
      }));
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: false,
        sightId: 'test-sight-2',
      };
      const { result, unmount } = renderHook(useInspectionGalleryItemLabel, { initialProps: item });

      expect(useSightLabel).toHaveBeenCalledWith({ labels });
      const { label } = (useSightLabel as jest.Mock).mock.results[0].value;
      expect(label).toHaveBeenCalledWith(sights[item.sightId]);
      expect(result.current).toEqual(expectedLabel);

      unmount();
    });

    it('should return the proper label for a taken item', () => {
      const expectedLabel = 'hello-test';
      (useObjectTranslation as jest.Mock).mockImplementationOnce(() => ({
        tObj: jest.fn(() => expectedLabel),
      }));
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: true,
        image: { label: { test: 'hello' } } as unknown as Image,
      };
      const { result, unmount } = renderHook(useInspectionGalleryItemLabel, { initialProps: item });

      expect(useObjectTranslation).toHaveBeenCalled();
      const { tObj } = (useObjectTranslation as jest.Mock).mock.results[0].value;
      expect(tObj).toHaveBeenCalledWith(item.image.label);
      expect(result.current).toEqual(expectedLabel);

      unmount();
    });

    it('should return an empty string if the taken item has no label', () => {
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: true,
        image: {} as Image,
      };
      const { result, unmount } = renderHook(useInspectionGalleryItemLabel, { initialProps: item });

      expect(result.current).toEqual('');

      unmount();
    });
  });

  describe('useInspectionGalleryItemStatusIconName hook', () => {
    it('should return the processing icon if the image is uploading', () => {
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.UPLOADING } as Image,
      };
      const { result, unmount } = renderHook(useInspectionGalleryItemStatusIconName, {
        initialProps: { item, captureMode: true },
      });

      expect(result.current).toEqual('processing');

      unmount();
    });

    it('should return the processing icon if the image compliance is running', () => {
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.COMPLIANCE_RUNNING } as Image,
      };
      const { result, unmount } = renderHook(useInspectionGalleryItemStatusIconName, {
        initialProps: { item, captureMode: true },
      });

      expect(result.current).toEqual('processing');

      unmount();
    });

    it('should return the check-circle icon if the image is validated', () => {
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.SUCCESS } as Image,
      };
      const { result, unmount } = renderHook(useInspectionGalleryItemStatusIconName, {
        initialProps: { item, captureMode: true },
      });

      expect(result.current).toEqual('check-circle');

      unmount();
    });

    it('should return the error icon if the image upload failed', () => {
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.UPLOAD_FAILED } as Image,
      };
      const { result, unmount } = renderHook(useInspectionGalleryItemStatusIconName, {
        initialProps: { item, captureMode: true },
      });

      expect(result.current).toEqual('error');

      unmount();
    });

    it('should return the error icon if the image is not compliant', () => {
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.NOT_COMPLIANT } as Image,
      };
      const { result, unmount } = renderHook(useInspectionGalleryItemStatusIconName, {
        initialProps: { item, captureMode: true },
      });

      expect(result.current).toEqual('error');

      unmount();
    });

    it('should return null if the image status is unknown', () => {
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: true,
        image: { status: 'test' } as unknown as Image,
      };
      const { result, unmount } = renderHook(useInspectionGalleryItemStatusIconName, {
        initialProps: { item, captureMode: true },
      });

      expect(result.current).toEqual(null);

      unmount();
    });

    it('should return null if not in capture mode', () => {
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: true,
        image: { status: ImageStatus.NOT_COMPLIANT } as Image,
      };
      const { result, unmount } = renderHook(useInspectionGalleryItemStatusIconName, {
        initialProps: { item, captureMode: false },
      });

      expect(result.current).toEqual(null);

      unmount();
    });

    it('should return null for the add damage item', () => {
      const item: InspectionGalleryItem = { isAddDamage: true };
      const { result, unmount } = renderHook(useInspectionGalleryItemStatusIconName, {
        initialProps: { item, captureMode: true },
      });

      expect(result.current).toEqual(null);

      unmount();
    });

    it('should return null for an untaken item', () => {
      const item: InspectionGalleryItem = { isAddDamage: false, isTaken: false, sightId: '' };
      const { result, unmount } = renderHook(useInspectionGalleryItemStatusIconName, {
        initialProps: { item, captureMode: true },
      });

      expect(result.current).toEqual(null);

      unmount();
    });
  });
});
