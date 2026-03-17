import { renderHook, act } from '@testing-library/react';
import { useMonkState, createEmptyMonkState } from '@monkvision/common';
import { useMonkApi } from '@monkvision/network';
import { Image, ImageType, Inspection, Viewpoint } from '@monkvision/types';
import { useInspectionGalleryActions } from '../../../../src/components/InspectionGallery/hooks';
import {
  UseInspectionGalleryActionsParams,
  UseInspectionGalleryActionsResult,
} from '../../../../src/components/InspectionGallery/hooks/useInspectionGalleryActions';
import {
  InspectionGalleryItem,
  NavigateToCaptureReason,
} from '../../../../src/components/InspectionGallery/types';

function createParams(
  overrides?: Partial<UseInspectionGalleryActionsParams>,
): UseInspectionGalleryActionsParams {
  return {
    inspectionId: 'test-inspection-id',
    apiConfig: {
      apiDomain: 'test-api-domain',
      authToken: 'test-auth-token',
      thumbnailDomain: 'test-thumbnail-domain',
    },
    captureMode: true,
    onNavigateToCapture: jest.fn(),
    ...overrides,
  };
}

describe('useInspectionGalleryActions hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with null selectedImage and selectedBeautyShotCandidates', () => {
    const params = createParams();
    const { result, unmount } = renderHook(useInspectionGalleryActions, {
      initialProps: params,
    });

    expect(result.current.selectedImage).toBeNull();
    expect(result.current.selectedBeautyShotCandidates).toBeNull();
    unmount();
  });

  describe('handleItemClick', () => {
    it('should navigate to capture with ADD_DAMAGE reason when clicking add damage item in capture mode', () => {
      const params = createParams();
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });
      const item: InspectionGalleryItem = { isAddDamage: true };

      act(() => {
        result.current.handleItemClick(item);
      });

      expect(params.onNavigateToCapture).toHaveBeenCalledWith({
        reason: NavigateToCaptureReason.ADD_DAMAGE,
      });
      expect(result.current.selectedImage).toBeNull();
      unmount();
    });

    it('should not navigate when clicking add damage item outside capture mode', () => {
      const onNavigateToCapture = jest.fn();
      const params = createParams({ captureMode: false, onNavigateToCapture });
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });
      const item: InspectionGalleryItem = { isAddDamage: true };

      act(() => {
        result.current.handleItemClick(item);
      });

      expect(onNavigateToCapture).not.toHaveBeenCalled();
      unmount();
    });

    it('should navigate to capture with CAPTURE_SIGHT reason when clicking untaken sight in capture mode', () => {
      const params = createParams();
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: false,
        sightId: 'test-sight-1',
      };

      act(() => {
        result.current.handleItemClick(item);
      });

      expect(params.onNavigateToCapture).toHaveBeenCalledWith({
        reason: NavigateToCaptureReason.CAPTURE_SIGHT,
        sightId: 'test-sight-1',
      });
      unmount();
    });

    it('should not navigate when clicking untaken sight outside capture mode', () => {
      const onNavigateToCapture = jest.fn();
      const params = createParams({ captureMode: false, onNavigateToCapture });
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: false,
        sightId: 'test-sight-1',
      };

      act(() => {
        result.current.handleItemClick(item);
      });

      expect(onNavigateToCapture).not.toHaveBeenCalled();
      unmount();
    });

    it('should set selectedImage when clicking a taken image', () => {
      const params = createParams();
      const image = { id: 'image-1', sightId: 'sight-1' } as unknown as Image;
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: true,
        image,
      };

      act(() => {
        result.current.handleItemClick(item);
      });

      expect(result.current.selectedImage).toBe(image);
      expect(result.current.selectedBeautyShotCandidates).toBeNull();
      expect(params.onNavigateToCapture).not.toHaveBeenCalled();
      unmount();
    });

    it('should set selectedBeautyShotCandidates when clicking a taken image with beauty shot candidates', () => {
      const params = createParams();
      const image = { id: 'image-1', sightId: 'sight-1' } as unknown as Image;
      const candidates = [{ id: 'alt-1' } as unknown as Image];
      const beautyShotCandidates = {
        view: 'front' as Viewpoint,
        candidates,
      };
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });
      const item: InspectionGalleryItem = {
        isAddDamage: false,
        isTaken: true,
        image,
        beautyShotCandidates,
      };

      act(() => {
        result.current.handleItemClick(item);
      });

      expect(result.current.selectedImage).toBe(image);
      expect(result.current.selectedBeautyShotCandidates).toBe(beautyShotCandidates);
      unmount();
    });
  });

  describe('handleRetakeImage', () => {
    it('should navigate to capture with RETAKE_PICTURE reason when image has a sightId in capture mode', () => {
      const params = createParams();
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });
      const image = { id: 'image-1', sightId: 'sight-1' } as unknown as Image;

      act(() => {
        result.current.handleRetakeImage(image);
      });

      expect(params.onNavigateToCapture).toHaveBeenCalledWith({
        reason: NavigateToCaptureReason.RETAKE_PICTURE,
        sightId: 'sight-1',
      });
      unmount();
    });

    it('should navigate to capture with ADD_DAMAGE reason for CLOSE_UP images in capture mode', () => {
      const params = createParams();
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });
      const image = {
        id: 'image-1',
        type: ImageType.CLOSE_UP,
      } as unknown as Image;

      act(() => {
        result.current.handleRetakeImage(image);
      });

      expect(params.onNavigateToCapture).toHaveBeenCalledWith({
        reason: NavigateToCaptureReason.ADD_DAMAGE,
      });
      unmount();
    });

    it('should not navigate when not in capture mode', () => {
      const onNavigateToCapture = jest.fn();
      const params = createParams({ captureMode: false, onNavigateToCapture });
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });
      const image = { id: 'image-1', sightId: 'sight-1' } as unknown as Image;

      act(() => {
        result.current.handleRetakeImage(image);
      });

      expect(onNavigateToCapture).not.toHaveBeenCalled();
      unmount();
    });

    it('should not navigate when image is null', () => {
      const params = createParams();
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });

      act(() => {
        result.current.handleRetakeImage(null);
      });

      expect(params.onNavigateToCapture).not.toHaveBeenCalled();
      unmount();
    });
  });

  describe('handleValidateNewBeautyShot', () => {
    it('should call updateAdditionalData with the correct parameters', () => {
      const state = createEmptyMonkState();
      const existingBeautyShots = { rear: 'existing-image-id' };
      state.inspections.push({
        id: 'test-inspection-id',
        additionalData: { beauty_shots: existingBeautyShots },
      } as unknown as Inspection);
      (useMonkState as jest.Mock).mockImplementation(() => ({ state }));

      const params = createParams();
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });
      const image = { id: 'new-image-id' } as unknown as Image;
      const view = 'front' as Viewpoint;

      act(() => {
        result.current.handleValidateNewBeautyShot(image, view);
      });

      const { updateAdditionalData } = (useMonkApi as jest.Mock).mock.results[0].value;
      expect(updateAdditionalData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-inspection-id',
        }),
      );

      const callbackArg = updateAdditionalData.mock.calls[0][0];
      const callbackResult = callbackArg.callback();
      expect(callbackResult).toEqual({
        beauty_shots: { rear: 'existing-image-id', front: 'new-image-id' },
      });
      unmount();
    });

    it('should handle errors gracefully', () => {
      const { updateAdditionalData } = (useMonkApi as jest.Mock).mock.results?.[0]?.value ?? {};
      if (updateAdditionalData) {
        updateAdditionalData.mockImplementation(() => {
          throw new Error('test-error');
        });
      }

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const params = createParams();
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });

      const { updateAdditionalData: mockUpdate } = (useMonkApi as jest.Mock).mock.results[0].value;
      mockUpdate.mockImplementation(() => {
        throw new Error('test-error');
      });

      const image = { id: 'new-image-id' } as unknown as Image;
      const view = 'front' as Viewpoint;

      act(() => {
        result.current.handleValidateNewBeautyShot(image, view);
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to update beauty shot:', expect.any(Error));
      consoleSpy.mockRestore();
      unmount();
    });
  });

  describe('handleCloseImageDetailedView', () => {
    it('should reset selectedImage and selectedBeautyShotCandidates to null', () => {
      const params = createParams();
      const image = { id: 'image-1' } as unknown as Image;
      const candidates = [{ id: 'alt-1' } as unknown as Image];
      const beautyShotCandidates = {
        view: 'front' as Viewpoint,
        candidates,
      };
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });

      act(() => {
        result.current.handleItemClick({
          isAddDamage: false,
          isTaken: true,
          image,
          beautyShotCandidates,
        });
      });

      expect(result.current.selectedImage).toBe(image);
      expect(result.current.selectedBeautyShotCandidates).toBe(beautyShotCandidates);

      act(() => {
        result.current.handleCloseImageDetailedView();
      });

      expect(result.current.selectedImage).toBeNull();
      expect(result.current.selectedBeautyShotCandidates).toBeNull();
      unmount();
    });
  });

  describe('imageDetailedViewCaptureProps', () => {
    it('should return capture props when in capture mode', () => {
      const params = createParams();
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });

      expect(result.current.imageDetailedViewCaptureProps).toEqual(
        expect.objectContaining({
          captureMode: true,
          showCaptureButton: true,
        }),
      );
      expect(result.current.imageDetailedViewCaptureProps).toHaveProperty('onNavigateToCapture');
      expect(result.current.imageDetailedViewCaptureProps).toHaveProperty('onRetake');
      unmount();
    });

    it('should return non-capture props when not in capture mode', () => {
      const params = createParams({ captureMode: false });
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });

      expect(result.current.imageDetailedViewCaptureProps).toEqual({ captureMode: false });
      unmount();
    });

    it('should call onNavigateToCapture with NONE reason when onNavigateToCapture is called from capture props', () => {
      const params = createParams();
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });

      const captureProps = result.current.imageDetailedViewCaptureProps;
      if ('onNavigateToCapture' in captureProps) {
        act(() => {
          captureProps.onNavigateToCapture();
        });

        expect(params.onNavigateToCapture).toHaveBeenCalledWith({
          reason: NavigateToCaptureReason.NONE,
        });
      }
      unmount();
    });

    it('should call handleRetakeImage with selectedImage when onRetake is called from capture props', () => {
      const params = createParams();
      const image = { id: 'image-1', sightId: 'sight-1' } as unknown as Image;
      const { result, unmount } = renderHook(useInspectionGalleryActions, {
        initialProps: params,
      });

      act(() => {
        result.current.handleItemClick({
          isAddDamage: false,
          isTaken: true,
          image,
        });
      });

      const captureProps = result.current.imageDetailedViewCaptureProps;
      if ('onRetake' in captureProps) {
        act(() => {
          captureProps.onRetake();
        });

        expect(params.onNavigateToCapture).toHaveBeenCalledWith({
          reason: NavigateToCaptureReason.RETAKE_PICTURE,
          sightId: 'sight-1',
        });
      }
      unmount();
    });
  });
});
