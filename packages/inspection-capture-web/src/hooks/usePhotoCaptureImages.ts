import { Image } from '@monkvision/types';
import { getInspectionImages, useMonkState } from '@monkvision/common';
import { useMemo } from 'react';

/**
 * Custom hook that returns the current images taken in the inspection (it filters retakes etc.).
 */
export function usePhotoCaptureImages(inspectionId: string): Image[] {
  const { state } = useMonkState();

  return useMemo(
    () => getInspectionImages(inspectionId, state.images, true),
    [state.images, inspectionId],
  );
}
