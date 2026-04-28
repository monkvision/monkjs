import { useMemo } from 'react';
import { AddDamage, ImageStatus, ImageType, Sight, Image, Viewpoint } from '@monkvision/types';
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
    [ImageStatus.UPLOAD_FAILED, ImageStatus.NOT_COMPLIANT, ImageStatus.UPLOAD_ERROR].includes(
      item.image.status,
    ) &&
    item.image.additionalData?.frame_index === undefined
  );
}

function isVideoFrame(item: InspectionGalleryItem): boolean {
  return !item.isAddDamage && item.isTaken && item.image.additionalData?.frame_index !== undefined;
}

function getFrameIndex(item: InspectionGalleryItem): number {
  return !item.isAddDamage && item.isTaken
    ? Number(item.image.additionalData?.frame_index ?? 0)
    : 0;
}

/**
 * Compare function used to determine the order of the gallery items. The current order is :
 * 1 - Pictures that need to be retaken (if compliance is enabled), sorted by sight order
 * 2 - Non-video items sorted by sight order
 * 3 - Video frames sorted by frame index
 * 4 - Additional pictures (Add Damage etc.)
 */
function compareGalleryItems(
  a: InspectionGalleryItem,
  b: InspectionGalleryItem,
  captureMode: boolean,
  inspectionSights?: Sight[],
): number {
  const aSightIndex = getSightSortIndex(a, inspectionSights);
  const bSightIndex = getSightSortIndex(b, inspectionSights);
  const aIsVideo = isVideoFrame(a);
  const bIsVideo = isVideoFrame(b);
  if (captureMode && needsToBeRetaken(a) && !needsToBeRetaken(b)) {
    return -1;
  }
  if (captureMode && !needsToBeRetaken(a) && needsToBeRetaken(b)) {
    return 1;
  }
  if (aIsVideo !== bIsVideo) {
    return aIsVideo ? 1 : -1;
  }
  if (aIsVideo && bIsVideo) {
    return getFrameIndex(a) - getFrameIndex(b);
  }
  return aSightIndex - bSightIndex;
}

/**
 * Extracts beauty shot gallery items from a set of inspection images. For each viewpoint, this
 * function finds the best representative image (either explicitly selected by the user via
 * additional data, or the highest-confidence image where the vehicle is fully in frame) and
 * groups remaining images as selectable candidates.
 */
function getBeautyShots(
  images: Image[],
  entities: MonkState,
  inspectionId: string,
): InspectionGalleryItem[] {
  const viewOrder = Object.values(Viewpoint);
  return viewOrder.reduce<InspectionGalleryItem[]>((result, view) => {
    const filterByView = images
      .filter((image) => image.viewpointConfidences?.[view] != null)
      .sort(
        (a, b) => (b.viewpointConfidences?.[view] ?? 0) - (a.viewpointConfidences?.[view] ?? 0),
      );
    const beautyShots = entities.inspections.find((inspection) => inspection.id === inspectionId)
      ?.additionalData?.['beauty_shots'] as Record<Viewpoint, string> | undefined;

    const explicit = images.find((image) => image.id === beautyShots?.[view]);
    if (explicit) {
      const candidates = filterByView.filter((image) => image.id !== explicit.id);
      result.push({
        isTaken: true,
        isAddDamage: false,
        beautyShotCandidates: { view, candidates },
        image: explicit,
      });
      return result;
    }
    const best = filterByView.find((image) => image.isVehicleFullyInFrame) ?? filterByView[0];
    if (best) {
      const candidates = filterByView.filter((image) => image !== best);
      result.push({
        isTaken: true,
        isAddDamage: false,
        beautyShotCandidates: { view, candidates },
        image: best,
      });
    }
    return result;
  }, []);
}

function getItems(
  inspectionId: string,
  captureMode: boolean,
  entities: MonkState,
  inspectionSights?: Sight[],
  addDamage?: AddDamage,
  filterByImageType?: ImageType,
  extractBeautyShots?: boolean,
): InspectionGalleryItem[] {
  const images = getInspectionImages(inspectionId, entities.images, filterByImageType, captureMode);
  const beautyShotItems: InspectionGalleryItem[] = extractBeautyShots
    ? getBeautyShots(images, entities, inspectionId)
    : [];
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
  const sorted = [
    ...beautyShotItems,
    ...items.sort((a, b) => compareGalleryItems(a, b, captureMode, inspectionSights)),
  ];
  if (captureMode && addDamage !== AddDamage.DISABLED) {
    sorted.push({ isAddDamage: true });
  }
  return sorted;
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
        props.addDamage,
        props.filterByImageType,
        props.enableBeautyShotExtraction,
      ),
    [
      props.inspectionId,
      props.captureMode,
      state,
      inspectionSights,
      props.addDamage,
      props.filterByImageType,
      props.enableBeautyShotExtraction,
    ],
  );
  const shouldFetch = useMemo(() => shouldContinueToFetch(items), [items]);

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
