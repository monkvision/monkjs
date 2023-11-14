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
  return inspection.severity_results?.map((severityResult) => {
    const damageId = severityResult.id;
    const partName = severityResult.label;
    const partId = inspection.parts?.find((part) => part.part_type === partName)?.id;
    const images = inspection.images?.filter(
      (image) => (['beauty_shot', 'close_up'].includes(image.image_type)
        && image.views?.some((view) => view?.element_id === partId)),
    )?.map((image) => ({
      id: image.id,
      image_type: image.image_type,
      object_type: image.object_type,
      url: image.path,
    })) ?? [];
    const severity = getSeverity(severityResult.value.custom_severity.level);
    const pricing = severityResult.value.custom_severity.pricing ?? 0;
    const repairOperation = getRepairOperation(
      severityResult.value.custom_severity.repair_operation?.REPLACE,
    );

    return {
      id: damageId,
      part: partName,
      images,
      severity,
      pricing,
      repairOperation,
    };
  }) ?? [];
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

  const resetState = useCallback(() => {
    setIsInspectionReady(false);
    setPictures([]);
    setDamages([]);
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
    damages,
    setDamages,
  };
}
