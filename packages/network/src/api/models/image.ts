import { TranslationObject } from '@monkvision/types';
import type { ApiAdditionalData, ApiCenterOnElement, ApiLabelPrediction } from './common';
import type { ApiRenderedOutputs } from './renderedOutput';
import type { ApiImageComplianceResults } from './compliance';
import type { ApiViews } from './view';
import { ApiBusinessTaskName, ApiHinlTaskPost, ApiImageCompliancesTaskPost } from './task';

export type ApiImageType = 'unknown' | 'beauty_shot' | 'close_up';

export type ApiImageSubType = 'close_up_part' | 'close_up_damage';

export interface ApiRelatedImage {
  base_image_id: string;
  base_image_type: ApiImageType;
  order?: number;
  path: string;
}

export type ApiRelatedImages = ApiRelatedImage[];

export interface ApiViewpointComponent {
  centers_on: ApiCenterOnElement[];
  distance?: string;
  is_exterior?: boolean;
}

export interface ApiImageAdditionalData extends ApiAdditionalData {
  created_at?: string;
  sight_id?: string;
  label?: TranslationObject;
}

export interface ApiImage {
  additional_data?: ApiImageAdditionalData;
  binary_size: number;
  compliances?: ApiImageComplianceResults;
  detailed_viewpoint?: ApiViewpointComponent;
  has_vehicle?: boolean;
  id: string;
  image_height: number;
  image_subtype?: ApiImageSubType;
  image_type: ApiImageType;
  image_sibling_key?: string;
  image_width: number;
  mimetype: string;
  name?: string;
  path: string;
  viewpoint?: ApiLabelPrediction;
}

export interface ApiImageWithViews extends ApiImage {
  rendered_outputs?: ApiRenderedOutputs;
  views?: ApiViews;
}

export type ApiImages = ApiImageWithViews[];

export interface ApiAcquisitionUrl {
  strategy: 'download_from_url';
  url: string;
}

export interface ApiAcquisitionForm {
  strategy: 'upload_multipart_form_keys';
  file_key: string;
}

export type ApiAcquisition = ApiAcquisitionUrl | ApiAcquisitionForm;

export type ApiComplianceParameters = Record<string, never>;

export interface ApiCoverage360Parameters {
  sight_id: string;
}

export interface ApiCompliance {
  image_quality_assessment?: ApiComplianceParameters;
  coverage_360?: ApiCoverage360Parameters;
  zoom_level?: ApiComplianceParameters;
}

export type ApiImagePostTask = ApiBusinessTaskName | ApiImageCompliancesTaskPost | ApiHinlTaskPost;

export interface ApiImagePost {
  acquisition: ApiAcquisition;
  tasks?: ApiImagePostTask[];
  name?: string;
  image_type?: ApiImageType;
  image_subtype?: ApiImageSubType;
  image_sibling_key?: string;
  compliances?: ApiCompliance;
  additional_data?: ApiImageAdditionalData;
}
