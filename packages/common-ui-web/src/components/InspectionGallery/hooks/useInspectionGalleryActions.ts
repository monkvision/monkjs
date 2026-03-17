import { useMemo, useState } from 'react';
import { Image, ImageType, Viewpoint } from '@monkvision/types';
import { useMonkState } from '@monkvision/common';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import {
  BeautyShotCandidates,
  InspectionGalleryItem,
  NavigateToCaptureOptions,
  NavigateToCaptureReason,
} from '../types';

export interface UseInspectionGalleryActionsParams {
  inspectionId: string;
  apiConfig: MonkApiConfig;
  captureMode: boolean;
  onNavigateToCapture?: (options: NavigateToCaptureOptions) => void;
}

export interface UseInspectionGalleryActionsResult {
  selectedImage: Image | null;
  selectedBeautyShotCandidates: BeautyShotCandidates | null;
  handleItemClick: (item: InspectionGalleryItem) => void;
  handleRetakeImage: (image: Image | null) => void;
  handleValidateNewBeautyShot: (image: Image, view: Viewpoint) => void;
  handleCloseImageDetailedView: () => void;
  imageDetailedViewCaptureProps:
    | {
        captureMode: true;
        showCaptureButton: true;
        onNavigateToCapture: () => void;
        onRetake: () => void;
      }
    | { captureMode: false };
}

export function useInspectionGalleryActions({
  inspectionId,
  apiConfig,
  captureMode,
  onNavigateToCapture,
}: UseInspectionGalleryActionsParams): UseInspectionGalleryActionsResult {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [selectedBeautyShotCandidates, setSelectedBeautyShotCandidates] =
    useState<BeautyShotCandidates | null>(null);
  const { state } = useMonkState();
  const { updateAdditionalData } = useMonkApi(apiConfig);

  const handleItemClick = (item: InspectionGalleryItem) => {
    if (item.isAddDamage && captureMode) {
      onNavigateToCapture?.({ reason: NavigateToCaptureReason.ADD_DAMAGE });
    } else if (!item.isAddDamage && !item.isTaken && captureMode) {
      onNavigateToCapture?.({
        reason: NavigateToCaptureReason.CAPTURE_SIGHT,
        sightId: item.sightId,
      });
    } else if (!item.isAddDamage && item.isTaken) {
      setSelectedImage(item.image);
      if (item.beautyShotCandidates?.candidates) {
        setSelectedBeautyShotCandidates(item.beautyShotCandidates);
      }
    }
  };

  const handleRetakeImage = (image: Image | null) => {
    if (captureMode && image?.sightId) {
      onNavigateToCapture?.({
        reason: NavigateToCaptureReason.RETAKE_PICTURE,
        sightId: image.sightId,
      });
    } else if (captureMode && image?.type === ImageType.CLOSE_UP) {
      onNavigateToCapture?.({
        reason: NavigateToCaptureReason.ADD_DAMAGE,
      });
    }
  };

  const handleValidateNewBeautyShot = (image: Image, view: Viewpoint) => {
    try {
      updateAdditionalData({
        id: inspectionId,
        callback: () => {
          const addData = state.inspections.find((inspection) => inspection.id === inspectionId)
            ?.additionalData?.['beauty_shots'] as Record<Viewpoint, string>;
          return { beauty_shots: { ...addData, [view]: image.id } };
        },
      });
    } catch (error) {
      console.error('Failed to update beauty shot:', error);
    }
  };

  const handleCloseImageDetailedView = () => {
    setSelectedImage(null);
    setSelectedBeautyShotCandidates(null);
  };

  const imageDetailedViewCaptureProps = useMemo(
    () =>
      captureMode
        ? {
            captureMode: true as const,
            showCaptureButton: true as const,
            onNavigateToCapture: () =>
              onNavigateToCapture?.({ reason: NavigateToCaptureReason.NONE }),
            onRetake: () => handleRetakeImage(selectedImage),
          }
        : { captureMode: false as const },
    [captureMode, onNavigateToCapture, selectedImage],
  );

  return {
    selectedImage,
    selectedBeautyShotCandidates,
    handleItemClick,
    handleRetakeImage,
    handleValidateNewBeautyShot,
    handleCloseImageDetailedView,
    imageDetailedViewCaptureProps,
  };
}
