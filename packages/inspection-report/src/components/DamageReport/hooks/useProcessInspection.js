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

function getRenderedOutputImage(image) {
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
    rendered_outputs: getRenderedOutputImage(image),
    label: image.additional_data?.label ?? undefined,
  }));
}

function getPartPictures(part, inspection) {
  const closeUpImageIds = inspection.parts
    .find((value) => value.part_type === part.part_type)
    ?.related_images.filter((image) => image.base_image_type === 'close_up')
    .map((image) => image.base_image_type);
  const closeUps = inspection.images
    .filter((image) => closeUpImageIds.includes(image.base_image_id));
  const beautyShotsWithDamages = inspection.images.filter((image) => (
    image.image_type === 'beauty_shot'
      && image.views?.some((view) => view.element_id === part.id)
      && image.views?.some((view) => part.damage_ids.includes(view.element_id))
  )).map((beautyShot) => {
    const view = beautyShot.views?.find((view) => view.element_id === part.id);
    return {
      ...beautyShot,
      size: view?.image_region?.specification?.bounding_box?.width * view?.image_region?.specification?.bounding_box?.height || 0
    }
  }).sort((a, b) => {
    return b.size - a.size;
  });
  const beautyShotsWithoutDamages = inspection.images.filter((image) => (
    image.image_type === 'beauty_shot'
      && image.views?.some((view) => view.element_id === part.id)
      && image.views?.some((view) => !part.damage_ids.includes(view.element_id))
  )).map((beautyShot) => {
    const view = beautyShot.views?.find((view) => view.element_id === part.id);
    return {
      ...beautyShot,
      size: view?.image_region?.specification?.bounding_box?.width * view?.image_region?.specification?.bounding_box?.height || 0
    }
  }).sort((a, b) => {
    return b.size - a.size;
  });

  return [...closeUps, ...beautyShotsWithDamages, ...beautyShotsWithoutDamages].map((image) => ({
    id: image.id,
    mimetype: image.mimetype,
    image_type: image.image_type,
    url: image.path,
    rendered_outputs: getRenderedOutputImage(image),
    label: image.additional_data?.label,
  }));
}

function getParts(inspection) {
  return inspection.parts.map((part) => ({
    ...part,
    images: getPartPictures(part, inspection),
  }));
}

function getDamages(inspection) {
  return inspection.severity_results?.map((severityResult) => ({
    id: severityResult.id,
    part: severityResult.label,
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
      .filter((task) => (task.status === monk.types.InspectionStatus.ERROR))
      .map((task) => task.name);
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
