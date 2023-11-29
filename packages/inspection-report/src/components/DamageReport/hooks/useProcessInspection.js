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
  if (!image) {
    return {
      id: '',
      isRendered: true,
      label: undefined,
      url: '',
    };
  }

  const damagedImage = image.rendered_outputs
    .find((damage) => damage?.additional_data?.description === 'rendering of detected damages');

  if (!damagedImage) {
    return {
      id: '',
      isRendered: true,
      label: undefined,
      url: '',
    };
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
    views: image.views,
    rendered_outputs: getRenderedOutputImages(image),
    label: image.additional_data?.label ?? undefined,
  }));
}

function getParts(inspection) {
  return inspection.parts.map((part) => ({
    ...part,
    images: part.related_images.map((image) => ({
      id: image.base_image_id,
      mimetype: image.mimetype,
      image_type: image.base_image_type,
      url: image.path,
      rendered_outputs: getRenderedOutputImages(),
      label: undefined,
    }))
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
        rendered_outputs: getRenderedOutputImages(
          inspection.images.find((pic) => pic.id === relatedImage?.base_image_id),
        ),
      }),
    ) ?? [],
    severity: getSeverity(severityResult.value.custom_severity.level),
    pricing: severityResult.value.custom_severity.pricing ?? 0,
    repairOperation: getRepairOperation(
      severityResult.value.custom_severity.repair_operation?.REPLACE,
    ),
  })) ?? [];
}

function isTaskDone(task, inspection) {
  switch (task.name) {
    case monk.types.TaskName.IMAGES_OCR:
      return task.status === monk.types.ProgressStatus.DONE
        || (task.status === monk.types.ProgressStatus.NOT_STARTED && !!inspection.vehicle.vin);
    default:
      return task.status === monk.types.ProgressStatus.DONE;
  }
}

export default function useProcessInspection() {
  const [isInspectionReady, setIsInspectionReady] = useState(false);
  const [inspectionErrors, setInspectionErrors] = useState({ isInError: false, tasks: [] });
  const [vinNumber, setVinNumber] = useState('');
  const [pictures, setPictures] = useState([]);
  const [damages, setDamages] = useState([]);
  const [parts, setParts] = useState([]);

  const resetState = useCallback(() => {
    setIsInspectionReady(false);
    setPictures([]);
    setDamages([]);
    setParts([]);
  }, []);

  const processInspection = useCallback((axiosResponse) => {
    const inspection = axiosResponse.data;
    const tasks = inspection.tasks.filter((task) => REQUIRED_INSPECTION_TASKS.includes(task.name));
    setIsInspectionReady(tasks.every((task) => isTaskDone(task, inspection)));
    const tasksInError = tasks
      .filter((task) => (task.status === monk.types.InspectionStatus.ERROR));
    setInspectionErrors({
      isInError: tasksInError.length > 0,
      tasks: tasksInError,
    });
    setPictures(getPictures(inspection));
    setParts(getParts(inspection));
    setDamages(getDamages(inspection));
    setVinNumber(inspection.vehicle?.vin);
  }, []);

  return {
    processInspection,
    resetState,
    isInspectionReady,
    inspectionErrors,
    vinNumber,
    pictures,
    parts,
    damages,
    setDamages,
  };
}
