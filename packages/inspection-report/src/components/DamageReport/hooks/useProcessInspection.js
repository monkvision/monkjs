import { useCallback, useState } from 'react';
import monk from '@monkvision/corejs';

import { RepairOperation, Severity } from '../../../resources';

const REQUIRED_INSPECTION_TASKS = [
  'damage_detection',
  'wheel_analysis',
  'images_ocr',
  'repair_estimate',
  'pricing',
  'dashboard_ocr',
];

function getRepairOperation(repairType) {
  switch (repairType) {
    case true:
      return RepairOperation.REPLACE;
    case false:
      return RepairOperation.REPAIR;
    default:
      return RepairOperation.REPAIR;
  }
}

function getSeverity(severityNumber) {
  switch (severityNumber) {
    case 1:
      return Severity.LOW;
    case 2:
      return Severity.MEDIUM;
    case 3:
      return Severity.HIGH;
    default:
      return null;
  }
}

function getRenderedOutputImages(image) {
  const damagedImage = image.rendered_outputs
    .find((damage) => damage?.additional_data?.description === 'rendering of detected damages');

  if (!damagedImage) {
    return;
  }

  return {
    id: damagedImage.id,
    isRendered: true,
    label: image.additional_data?.label ?? undefined,
    url: damagedImage.path,
  };
}

function getPictures(inspection) {
  return inspection.images.map((image) => ({
    id: image.id,
    width: image.width,
    height: image.height,
    mimetype: image.mimetype,
    image_type: image.image_type,
    url: image.path,
    rendered_outputs: getRenderedOutputImages(image),
    label: image.additional_data?.label ?? undefined,
  }));
}

function getDamages(inspection) {
  return inspection.severity_results?.map((severityResult) => ({
    id: severityResult.id,
    part: severityResult.label,
    images: inspection.parts?.find(
      (inspectionPart) => (inspectionPart.id === severityResult.related_item_id),
    )?.related_images?.map(
      (relatedImage) => ({
        id: relatedImage.base_image_id,
        base_image_type: relatedImage.base_image_type,
        object_type: relatedImage.object_type,
        url: relatedImage.path,
      }),
    ) ?? [],
    severity: getSeverity(severityResult.value.custom_severity.level),
    pricing: severityResult.value.custom_severity.pricing ?? 0,
    repairOperation: getRepairOperation(
      severityResult.value.custom_severity.repair_operation?.REPLACE,
    ),
  })) ?? [];
}

export default function useProcessInspection() {
  const [isInspectionReady, setIsInspectionReady] = useState(false);
  const [inspectionErrors, setInspectionErrors] = useState({ isInError: false, tasks: [] });
  const [vinNumber, setVinNumber] = useState('');
  const [pictures, setPictures] = useState([]);
  const [damages, setDamages] = useState([]);

  const resetState = useCallback(() => {
    setIsInspectionReady(false);
    setPictures([]);
    setDamages([]);
  }, []);

  const processInspection = useCallback((axiosResponse) => {
    const tasks = axiosResponse.data.tasks
      .filter((task) => REQUIRED_INSPECTION_TASKS.includes(task.name));
    setIsInspectionReady(
      tasks.every((task) => (task.status === monk.types.InspectionStatus.DONE)),
    );
    const tasksInError = tasks
      .filter((task) => (task.status === monk.types.InspectionStatus.ERROR));
    setInspectionErrors({
      isInError: tasksInError.length > 0,
      tasks: tasksInError,
    });
    setPictures(getPictures(axiosResponse.data));
    setDamages(getDamages(axiosResponse.data));
    setVinNumber(axiosResponse.data?.vehicle?.vin);
  }, []);

  return {
    processInspection,
    resetState,
    isInspectionReady,
    inspectionErrors,
    vinNumber,
    pictures,
    damages,
    setDamages,
  };
}
