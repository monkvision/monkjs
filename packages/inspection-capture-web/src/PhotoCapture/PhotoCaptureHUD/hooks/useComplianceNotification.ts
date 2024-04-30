import { ImageStatus } from '@monkvision/types';
import { getInspectionImages, useMonkState } from '@monkvision/common';
import { useMemo } from 'react';

/**
 * Custom hook used to check if the notification indicating if there are some pictures to be retaken should be displayed
 * or not.
 */
export function useComplianceNotification(inspectionId: string): boolean {
  const { state } = useMonkState();

  return useMemo(
    () =>
      getInspectionImages(inspectionId, state.images, true).some((image) =>
        [ImageStatus.NOT_COMPLIANT, ImageStatus.UPLOAD_FAILED].includes(image.status),
      ),
    [state, inspectionId],
  );
}
