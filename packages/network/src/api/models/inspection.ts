import type { ApiAdditionalData } from './common';
import { ApiDamages, ApiDamageSimplifiedGet } from './damage';
import { ApiImage, ApiImagePost, ApiImages } from './image';
import { ApiParts, ApiPartSimplifiedGet } from './part';
import type { ApiPricingV2 } from './pricingV2';
import type { ApiSeverityResults } from './severityResult';
import type { ApiBusinessClients, ApiTasks } from './task';
import { ApiTasksComponent } from './task';
import type { ApiVehicleComponent } from './vehicle';
import { ApiVehiclePostPatch } from './vehicle';
import type { ApiWheelAnalysis } from './wheelAnalysis';

export interface ApiInspectioAdditionalData extends ApiAdditionalData {
  is_video_capture?: boolean;
  use_3d_projection?: boolean;
}

export interface ApiInspectionGet {
  additional_data?: ApiInspectioAdditionalData;
  damages: ApiDamages;
  id: string;
  images: ApiImages;
  parts: ApiParts;
  pdf_generation_ready?: boolean;
  pricing?: ApiPricingV2;
  severity_results?: ApiSeverityResults;
  tasks: ApiTasks;
  vehicle?: ApiVehicleComponent;
  wheel_analysis?: ApiWheelAnalysis;
}

export type ApiPaginationOrder = 'asc' | 'desc';

export interface ApiPaginationParameters {
  limit?: number;
  before?: string;
  after?: string;
  pagination_order?: ApiPaginationOrder;
}

export interface ApiCursors {
  after?: string;
  before?: string;
  next?: ApiPaginationParameters;
  previous?: ApiPaginationParameters;
}

export interface ApiPagination {
  cursors: ApiPaginationParameters;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  paging: ApiPagination;
}

export interface ApiAllInspectionsGet {
  id: string;
  images: ApiImage[];
  owner_id: string;
  creator_id: string;
  created_at: string;
  deleted_at?: string;
  additional_data?: ApiInspectioAdditionalData;
}

export interface ApiAllInspectionsVerboseGet extends ApiAllInspectionsGet {
  pricing?: ApiPricingV2;
  pdf_url?: string;
  plate?: string;
  damages: ApiDamageSimplifiedGet[];
  parts: ApiPartSimplifiedGet[];
  vehicle?: ApiVehicleComponent;
}

export interface ApiInspectionsCountGet {
  total: number;
  sub_count?: Record<string, number>;
}

export interface ApiDamageSeverity {
  output_format: ApiBusinessClients;
}

export interface ApiInspectionPost {
  additional_data?: ApiInspectioAdditionalData;
  tasks: ApiTasksComponent;
  images?: ApiImagePost[];
  vehicle?: ApiVehiclePostPatch;
  damage_severity?: ApiDamageSeverity;
}
