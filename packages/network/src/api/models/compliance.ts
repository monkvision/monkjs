import type { ApiTaskProgressStatus } from './task';

export type ApiImageComplianceStatus = 'unknown' | 'compliant' | 'non_compliant';

export interface ApiIQAComplianceDetails {
  blurriness_score?: number;
  overexposure_score?: number;
  underexposure_score?: number;
}

export interface ApiIQAComplianceResult {
  details?: ApiIQAComplianceDetails;
  is_compliant?: boolean;
  reasons?: string[];
  status: ApiTaskProgressStatus;
}

export interface ApiComplianceResultBase {
  is_compliant?: boolean;
  reasons?: string[];
  status: ApiTaskProgressStatus;
}

export interface ApiComplianceZoomLevelDetails {
  zoom_score?: number;
}

export interface ApiZoomLevelComplianceResult {
  details?: ApiComplianceZoomLevelDetails;
  is_compliant?: boolean;
  reasons?: string[];
  status: ApiTaskProgressStatus;
}

export interface ApiVehicleAnalysis {
  is_vehicle_present: boolean;
  wetness?: number;
  snowness?: number;
  dirtiness?: number;
  reflections?: number;
}

export type ApiImageOrientation = 'other' | 'landscape' | 'portrait';

export type ApiPredictedImageType = 'unknown' | 'beauty_shot' | 'close_up';

export interface ApiImageAnalysis {
  binary_size: number;
  image_height: number;
  image_width: number;
  orientation: ApiImageOrientation;
  predicted_image_type: ApiPredictedImageType;
  zoom?: number;
  blurriness?: number;
  overexposure?: number;
  underexposure?: number;
  lens_flare?: number;
}

export interface ApiImageComplianceResults {
  compliance_status?: ApiImageComplianceStatus;
  coverage_360?: ApiComplianceResultBase;
  image_quality_assessment?: ApiIQAComplianceResult;
  zoom_level?: ApiZoomLevelComplianceResult;
  vehicle_analysis?: ApiVehicleAnalysis;
  image_analysis?: ApiImageAnalysis;
  compliance_issues?: string[];
  should_retake?: boolean;
}
