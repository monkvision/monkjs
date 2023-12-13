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

export interface ApiImageComplianceResults {
  compliance_status?: ApiImageComplianceStatus;
  coverage_360?: ApiComplianceResultBase;
  image_quality_assessment?: ApiIQAComplianceResult;
  zoom_level?: ApiZoomLevelComplianceResult;
}
