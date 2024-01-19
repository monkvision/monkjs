import { TranslationObject } from '@monkvision/types';
import type { ApiAdditionalData, ApiCenterOnElement, ApiLabelPrediction } from './common';
import type { ApiRenderedOutputs } from './renderedOutput';
import type { ApiImageComplianceResults } from './compliance';
import type { ApiViews } from './view';

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
  sightId?: string;
  label?: TranslationObject;
}

export interface ApiImageWithViews {
  additional_data?: ApiImageAdditionalData;
  binary_size: number;
  compliances?: ApiImageComplianceResults;
  detailed_viewpoint?: ApiViewpointComponent;
  has_vehicle?: boolean;
  id: string;
  image_height: number;
  image_subtype?: ApiImageSubType;
  image_type: ApiImageType;
  image_width: number;
  mimetype: string;
  name?: string;
  path: string;
  rendered_outputs?: ApiRenderedOutputs;
  viewpoint?: ApiLabelPrediction;
  views?: ApiViews;
}

export type ApiImages = ApiImageWithViews[];
