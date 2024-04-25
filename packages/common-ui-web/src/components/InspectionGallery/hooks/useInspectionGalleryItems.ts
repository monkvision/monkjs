import { useState } from 'react';
import { Image, ImageStatus, Sight } from '@monkvision/types';
import { MonkState, useMonkState } from '@monkvision/common';
import { useInspectionPoll } from '@monkvision/network';
import { InspectionGalleryItem, InspectionGalleryProps } from '../types';

const DEFAULT_REFRESH_INTERVAL_MS = 1000;

function getSightSortIndex(item: InspectionGalleryItem, inspectionSights?: Sight[]): number {
  const defaultIndex = 9999;
  if (item.isAddDamage) {
    return defaultIndex + 1;
  }
  const sightId = item.isTaken ? item.image.additionalData?.sight_id : item.sightId;
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
  enableCompliance: boolean,
  inspectionSights?: Sight[],
): number {
  const aSightIndex = getSightSortIndex(a, inspectionSights);
  const bSightIndex = getSightSortIndex(b, inspectionSights);
  if (enableCompliance) {
    if (needsToBeRetaken(a) && needsToBeRetaken(b)) {
      return aSightIndex - bSightIndex;
    }
    if (needsToBeRetaken(a) && !needsToBeRetaken(b)) {
      return -1;
    }
    if (!needsToBeRetaken(a) && needsToBeRetaken(b)) {
      return 1;
    }
  }
  return aSightIndex - bSightIndex;
}

function getItems(
  inspectionId: string,
  captureMode: boolean,
  entities: MonkState,
  enableCompliance: boolean,
  inspectionSights?: Sight[],
): InspectionGalleryItem[] {
  const inspection = entities.inspections.find((i) => i.id === inspectionId);
  const items: InspectionGalleryItem[] = [];
  entities.images
    .filter((image) => inspection?.images.includes(image.id))
    .forEach((image) => {
      const item: InspectionGalleryItem = { isTaken: true, isAddDamage: false, image };
      const itemSightId = image.additionalData?.sight_id;
      if (!captureMode || !itemSightId) {
        items.push(item);
      } else {
        const index = items.findIndex(
          (i) => !i.isAddDamage && i.isTaken && i.image.additionalData?.sight_id === itemSightId,
        );
        if (index >= 0) {
          const itemDateISO = image.additionalData?.created_at;
          const alreadyExistingImageDateISO = (items[index] as { image: Image }).image
            .additionalData?.created_at;
          if (
            alreadyExistingImageDateISO &&
            itemDateISO &&
            new Date(itemDateISO) > new Date(alreadyExistingImageDateISO)
          ) {
            items[index] = item;
          }
        } else {
          items.push(item);
        }
      }
    });
  inspectionSights?.forEach((sight) => {
    if (
      !items.find(
        (item) =>
          !item.isAddDamage && item.isTaken && item.image.additionalData?.sight_id === sight.id,
      )
    ) {
      items.push({ isTaken: false, isAddDamage: false, sightId: sight.id });
    }
  });
  if (captureMode) {
    items.push({ isAddDamage: true });
  }
  return items.sort((a, b) => compareGalleryItems(a, b, enableCompliance, inspectionSights));
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
  const enableCompliance = props.captureMode && props.enableCompliance !== false;
  const inspectionSights = props.captureMode ? props.sights : undefined;
  const { state } = useMonkState();
  const [items, setItems] = useState<InspectionGalleryItem[]>(
    getItems(props.inspectionId, props.captureMode, state, enableCompliance, inspectionSights),
  );
  const [shouldFetch, setShouldFetch] = useState(shouldContinueToFetch(items));

  const onSuccess = (entities: MonkState) => {
    const newItems = getItems(
      props.inspectionId,
      props.captureMode,
      entities,
      enableCompliance,
      inspectionSights,
    );
    setItems(newItems);
    setShouldFetch(shouldContinueToFetch(newItems));
  };

  useInspectionPoll({
    id: props.inspectionId,
    apiConfig: props.apiConfig,
    compliance: props.captureMode
      ? { enableCompliance, complianceIssues: props.complianceIssues }
      : undefined,
    delay: shouldFetch ? props.refreshIntervalMs ?? DEFAULT_REFRESH_INTERVAL_MS : null,
    onSuccess,
  });

  return items;
}
