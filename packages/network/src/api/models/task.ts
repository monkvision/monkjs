import { ApiPricingMethodology } from './pricingV2';
import { ApiWheelType } from './wheelAnalysis';

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
  | 'compliances'
  | 'human_in_the_loop';

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

export interface ApiImagesOCRImageDetails {
  image_type: 'VIN';
}

export interface ApiImagesOCRTaskPost {
  name: 'images_ocr';
  image_details: ApiImagesOCRImageDetails;
}

export interface ApiImagesOdometerTaskPost {
  name: 'odometer';
  wait_for_result?: boolean;
}

export interface ApiImagesWarningLightsTaskPost {
  name: 'warning_lights';
  wait_for_result?: boolean;
}

export interface ApiWheelAnalysisImageDetails {
  wheel_name: ApiWheelType;
}

export interface ApiImagesWheelAnalysisTaskPost {
  name: 'wheel_analysis';
  image_details: ApiWheelAnalysisImageDetails;
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
  arguments?: Record<string, unknown>;
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

export type ApiSizeBucketLimitsCm =
  | [number]
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

export interface ApiDampartConfidenceScore {
  size_bucket_limits_cm: ApiSizeBucketLimitsCm;
}

export interface ApiDamageDetectionTaskPostComponent {
  status?: ApiTaskPostProgressStatus;
  callbacks?: ApiCallbacks;
  damage_score_threshold?: number;
  generate_subimages_parts?: ApiGenerateSubImages;
  generate_subimages_damages?: ApiGenerateSubImages;
  generate_visual_output?: GenerateVisualOutput;
  scoring?: Record<string, unknown>;
  dampart_confidence_score?: ApiDampartConfidenceScore;
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
  output_format?: string;
  config?: string;
  methodology?: ApiPricingMethodology;
}

export interface ApiOdometerTaskPostComponent {
  status?: ApiTaskPostProgressStatus;
}

export interface ApiWarningLightsTaskPostComponent {
  status?: ApiTaskPostProgressStatus;
}

export interface ApiTasksComponent {
  damage_detection?: ApiDamageDetectionTaskPostComponent;
  wheel_analysis?: ApiWheelAnalysisTaskPostComponent;
  images_ocr?: ApiImagesOCRTaskPostComponent;
  human_in_the_loop?: ApiHinlTaskPostComponent;
  pricing?: ApiPricingTaskPostComponent;
  odometer?: ApiOdometerTaskPostComponent;
  warning_lights?: ApiWarningLightsTaskPostComponent;
}
