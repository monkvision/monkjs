import { MonkApiPermission } from '@monkvision/types';

export const REQUIRED_PERMISSIONS = [
  MonkApiPermission.TASK_COMPLIANCES,
  MonkApiPermission.TASK_DAMAGE_DETECTION,
  MonkApiPermission.TASK_DAMAGE_IMAGES_OCR,
  MonkApiPermission.TASK_WHEEL_ANALYSIS,
  MonkApiPermission.INSPECTION_CREATE,
  MonkApiPermission.INSPECTION_READ,
  MonkApiPermission.INSPECTION_UPDATE,
  MonkApiPermission.INSPECTION_WRITE,
];
