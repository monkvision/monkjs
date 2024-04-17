import { useAnalytics } from '@monkvision/analytics';
import { useMonkState } from '@monkvision/common';
import { ComplianceIssue, Image, ImageStatus, ImageType, Sight } from '@monkvision/types';
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
  const { state } = useMonkState();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const newImagesEventTracking = state.images
      .filter(
        (image) => image.inspectionId === inspectionId && image.type === ImageType.BEAUTY_SHOT,
      )
      .map((image) => {
        const imageEventTracking = imagesEventTracking.find((i) => i.id === image.id);
        if (imageEventTracking?.isAlreadySent) {
          return imageEventTracking;
        }
        if (image.status === ImageStatus.NOT_COMPLIANT && image.complianceIssues) {
          trackEvent('Compliance Issue', {
            ...Object.fromEntries(
              Object.values(ComplianceIssue).map((issue) => [
                issue,
                image.complianceIssues?.includes(issue),
              ]),
            ),
            sightId: image.additionalData?.sight_id,
            sightLabel: sights.find((sight) => sight.id === image.additionalData?.sight_id)?.label,
          });
          return { ...image, isAlreadySent: true };
        }
        return { ...image, isAlreadySent: false };
      });

    setImagesEventTracking(newImagesEventTracking);
  }, [state]);
}
