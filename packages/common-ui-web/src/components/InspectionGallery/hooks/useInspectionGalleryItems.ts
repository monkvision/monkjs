import { useMemo } from 'react';
import { ImageStatus, Sight } from '@monkvision/types';
import { getInspectionImages, MonkState, useMonkState } from '@monkvision/common';
import { useInspectionPoll } from '@monkvision/network';
import { InspectionGalleryItem, InspectionGalleryProps } from '../types';

const DEFAULT_REFRESH_INTERVAL_MS = 1000;

function getSightSortIndex(item: InspectionGalleryItem, inspectionSights?: Sight[]): number {
  const defaultIndex = 9999;
  if (item.isAddDamage) {
    return defaultIndex + 1;
  }
  const sightId = item.isTaken ? item.image.sightId : item.sightId;
  if (!sightId) {
    return defaultIndex;
  }
  const index = inspectionSights?.findIndex((sight) => sight.id === sightId);
  return index !== undefined && index >= 0 ? index : defaultIndex;
}

function needsToBeRetaken(item: InspectionGalleryItem): boolean {
  return (
    !item.isAddDamage &&
    item.isTaken &&
    [ImageStatus.UPLOAD_FAILED, ImageStatus.NOT_COMPLIANT].includes(item.image.status)
  );
}

/**
 * Compare function used to determine the order of the gallery items. The current order is :
 * 1 - Pictures that need to be retaken (if compliance is enabled), sorted by sight order
 * 2 - Taken or not taken pictures sorted by sight order
 * 3 - Additional pictures (Add Damage etc...)
 */
function compareGalleryItems(
  a: InspectionGalleryItem,
  b: InspectionGalleryItem,
  captureMode: boolean,
  inspectionSights?: Sight[],
): number {
  const aSightIndex = getSightSortIndex(a, inspectionSights);
  const bSightIndex = getSightSortIndex(b, inspectionSights);
  if (captureMode && needsToBeRetaken(a) && !needsToBeRetaken(b)) {
    return -1;
  }
  if (captureMode && !needsToBeRetaken(a) && needsToBeRetaken(b)) {
    return 1;
  }
  return aSightIndex - bSightIndex;
}

function getItems(
  inspectionId: string,
  captureMode: boolean,
  entities: MonkState,
  inspectionSights?: Sight[],
  enableAddDamage?: boolean,
): InspectionGalleryItem[] {
  const images = getInspectionImages(inspectionId, entities.images, captureMode);
  const items: InspectionGalleryItem[] = images.map((image) => ({
    isTaken: true,
    isAddDamage: false,
    image,
  }));
  inspectionSights?.forEach((sight) => {
    if (
      captureMode &&
      !items.find((item) => !item.isAddDamage && item.isTaken && item.image.sightId === sight.id)
    ) {
      items.push({ isTaken: false, isAddDamage: false, sightId: sight.id });
    }
  });
  if (captureMode && enableAddDamage !== false) {
    items.push({ isAddDamage: true });
  }
  return items.sort((a, b) => compareGalleryItems(a, b, captureMode, inspectionSights));
}

function shouldContinueToFetch(items: InspectionGalleryItem[]): boolean {
  return items.some(
    (item) =>
      !item.isAddDamage &&
      item.isTaken &&
      [ImageStatus.UPLOADING, ImageStatus.COMPLIANCE_RUNNING].includes(item.image.status),
  );
}

export function useInspectionGalleryItems(props: InspectionGalleryProps): InspectionGalleryItem[] {
  const inspectionSights = props.captureMode ? props.sights : undefined;
  const { state } = useMonkState();

  const items = useMemo(
    () =>
      getItems(
        props.inspectionId,
        props.captureMode,
        state,
        inspectionSights,
        props.enableAddDamage,
      ),
    [props.inspectionId, props.captureMode, state, inspectionSights, props.enableAddDamage],
  );
  const shouldFetch = useMemo(() => shouldContinueToFetch(items), items);

  useInspectionPoll({
    id: props.inspectionId,
    apiConfig: props.apiConfig,
    compliance: props.captureMode
      ? {
          enableCompliance: props.enableCompliance,
          enableCompliancePerSight: props.enableCompliancePerSight,
          useLiveCompliance: props.useLiveCompliance,
          complianceIssues: props.complianceIssues,
          complianceIssuesPerSight: props.complianceIssuesPerSight,
          customComplianceThresholds: props.customComplianceThresholds,
          customComplianceThresholdsPerSight: props.customComplianceThresholdsPerSight,
        }
      : undefined,
    delay: shouldFetch ? props.refreshIntervalMs ?? DEFAULT_REFRESH_INTERVAL_MS : null,
  });

  return items;
}
