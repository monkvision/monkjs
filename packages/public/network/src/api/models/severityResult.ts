import type { ApiReservedPartsNames } from './common';

export type ApiLabel = ApiReservedPartsNames;

export type ApiLevel = 1 | 2 | 3;

export interface ApiCommentSeverityValue {
  comment: string;
  level?: ApiLevel;
  pricing?: number;
}

export interface ApiRepairOperationV1 {
  ADDITIONAL?: boolean;
  PAINT?: number;
  REPLACE?: boolean;
  T1?: number;
  T2?: number;
}

export interface ApiPartSeverityValue {
  level: ApiLevel;
  pricing?: number;
  repair_operation?: ApiRepairOperationV1;
}

export interface ApiPricingSeverityOnly {
  pricing: number;
}

export type ApiCustomSeverity =
  | ApiCommentSeverityValue
  | ApiPartSeverityValue
  | ApiPricingSeverityOnly;

export interface ApiSeverityResultValue {
  custom_severity: ApiCustomSeverity;
}

export type ApiSeverityResultTargetType = 'part' | 'damage' | 'comment';

export interface ApiSeverityResult {
  id: string;
  is_user_modified: boolean;
  label: ApiLabel;
  related_item_id?: string;
  related_item_type?: ApiSeverityResultTargetType;
  value: ApiSeverityResultValue;
}

export type ApiSeverityResults = ApiSeverityResult[];
