export type ApiBusinessClients = 'default' | 'toyota' | 'veb' | 'tesla';

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

export interface ApiImageCompliancesDetails {
  sight_id: string;
}

export interface ApiImageCompliancesTaskPost {
  name: 'compliances';
  image_details?: ApiImageCompliancesDetails;
  wait_for_result?: boolean;
}

export interface ApiHinlImageDetails {
  sight_label: string;
}

export interface ApiHinlTaskPost {
  name: 'human_in_the_loop';
  image_details: ApiHinlImageDetails;
}

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

export type ApiCallbackEventEnum = 'STATUS_SET_TO_DONE' | 'STATUS_SET_TO_ERROR';

export type ApiCallbackEvent = ApiCallbackEventEnum | ApiCallbackEventEnum[];

export interface ApiCallback {
  url: string;
  headers: Record<string, unknown>;
  callback_event?: ApiCallbackEvent;
  params?: Record<string, unknown>;
}

export type ApiCallbacks = ApiCallback[];

export type ApiTaskPostProgressStatus = 'NOT_STARTED' | 'TODO' | 'DONE' | 'VALIDATED';

export interface ApiGenerateSubImages {
  margin?: number;
  damage_view_part_interpolation?: number;
  ratio?: number;
  quality?: number;
  generate_tight?: boolean;
}

export interface GenerateVisualOutput {
  generate_parts?: boolean;
  generate_damages?: boolean;
}

export interface ApiDamageDetectionTaskPostComponent {
  status?: ApiTaskPostProgressStatus;
  callbacks?: ApiCallbacks;
  damage_score_threshold?: number;
  generate_subimages_parts?: ApiGenerateSubImages;
  generate_subimages_damages?: ApiGenerateSubImages;
  generate_visual_output?: GenerateVisualOutput;
  scoring?: Record<string, unknown>;
}

export interface ApiWheelAnalysisTaskPostComponent {
  status?: ApiTaskPostProgressStatus;
  callbacks?: ApiCallbacks;
  use_longshots?: boolean;
}

export interface ApiImagesOCRTaskPostComponent {
  status?: ApiTaskPostProgressStatus;
  callbacks?: ApiCallbacks;
}

export interface ApiHinlTaskPostComponent {
  status?: ApiTaskPostProgressStatus;
  callbacks?: ApiCallbacks;
}

export interface ApiPricingTaskPostComponent {
  status?: ApiTaskPostProgressStatus;
  callbacks?: ApiCallbacks;
  output_format?: ApiBusinessClients;
}

export interface ApiTasksComponent {
  damage_detection?: ApiDamageDetectionTaskPostComponent;
  wheel_analysis?: ApiWheelAnalysisTaskPostComponent;
  images_ocr?: ApiImagesOCRTaskPostComponent;
  human_in_the_loop?: ApiHinlTaskPostComponent;
  pricing?: ApiPricingTaskPostComponent;
}
