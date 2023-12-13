import type { ApiLabelPrediction } from './common';

export type ApiWheelType =
  | 'wheel_front_left'
  | 'wheel_front_right'
  | 'wheel_back_left'
  | 'wheel_back_right';

export interface ApiWheelAnalysisWithImageId {
  hubcap_condition: ApiLabelPrediction;
  hubcap_over_rim: ApiLabelPrediction;
  hubcap_visual_aspect: ApiLabelPrediction;
  image_id?: string;
  rim_condition: ApiLabelPrediction;
  rim_material: ApiLabelPrediction;
  rim_visual_aspect: ApiLabelPrediction;
  wheel_name?: ApiWheelType;
}

export type ApiWheelAnalysis = ApiWheelAnalysisWithImageId[];
