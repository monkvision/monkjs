export interface ApiImageInTask {
  image_id: string;
}

export type ApiBusinessTaskName =
  | 'damage_detection'
  | 'wheel_analysis'
  | 'repair_estimate'
  | 'images_ocr'
  | 'image_editing'
  | 'inspection_pdf'
  | 'pricing'
  | 'dashboard_ocr'
  | 'zoom_level'
  | 'coverage_360'
  | 'iqa_compliance'
  | 'compliances';

export type ApiTaskProgressStatus =
  | 'NOT_STARTED'
  | 'TODO'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'ERROR'
  | 'ABORTED'
  | 'VALIDATED';

export interface ApiTaskGet {
  id: string;
  images: ApiImageInTask[];
  name: ApiBusinessTaskName;
  status: ApiTaskProgressStatus;
}

export type ApiTasks = ApiTaskGet[];
