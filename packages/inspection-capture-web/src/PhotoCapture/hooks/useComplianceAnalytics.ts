import { useAnalytics } from '@monkvision/analytics';
import { useMonkState } from '@monkvision/common';
import { Image, ImageStatus, Sight } from '@monkvision/types';
import { useEffect, useState } from 'react';

interface ImageEventTracking extends Image {
  isAlreadySent: boolean;
}

/**
 * Parameters of the useComplianceAnalytics hook.
 */
export interface ComplianceAnalyticsParams {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The list of sights passed to the PhotoCapture component.
   */
  sights: Sight[];
}

/**
 * Custom hook used for the compliance analytics by sending an event for 'non_compliant' image.
 */
export function useComplianceAnalytics({ inspectionId, sights }: ComplianceAnalyticsParams) {
  const [imagesEventTracking, setImagesEventTracking] = useState<ImageEventTracking[]>([]);
  const [isInitialInspectionFetched, setIsInitialInspectionFetched] = useState(false);
  const { state } = useMonkState();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const newImagesEventTracking = state.images
      .filter((image) => image.inspectionId === inspectionId && image.sightId)
      .map((image) => {
        const imageEventTracking = imagesEventTracking.find((i) => i.id === image.id);
        if (imageEventTracking?.isAlreadySent) {
          return imageEventTracking;
        }
        if (image.status === ImageStatus.NOT_COMPLIANT && image.complianceIssues) {
          if (isInitialInspectionFetched) {
            trackEvent('Compliance Issue', {
              complianceIssue: image.complianceIssues.at(0),
              sightId: image.sightId,
              sightLabel: sights.find((sight) => sight.id === image.sightId)?.label,
            });
          }
          return { ...image, isAlreadySent: true };
        }
        return { ...image, isAlreadySent: false };
      });

    setImagesEventTracking(newImagesEventTracking);
  }, [state]);
  return { setIsInitialInspectionFetched };
}
