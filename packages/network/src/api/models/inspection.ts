import type { ApiAdditionalData } from './common';
import type { ApiDamages } from './damage';
import type { ApiImagePost, ApiImages } from './image';
import type { ApiParts } from './part';
import type { ApiPricingV2 } from './pricingV2';
import type { ApiSeverityResults } from './severityResult';
import type { ApiTasks } from './task';
import type { ApiVehicleComponent } from './vehicle';
import type { ApiWheelAnalysis } from './wheelAnalysis';
import { ApiVehiclePostPatch } from './vehicle';
import { ApiTasksComponent } from './task';

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

export type ApiBusinessClients = 'default' | 'toyota' | 'veb';

export interface ApiDamageSeverity {
  output_format: ApiBusinessClients;
}

export interface ApiInspectionPost {
  additional_data?: ApiInspectioAdditionalData;
  tasks: ApiTasksComponent;
  images?: ApiImagePost[];
  vehicle?: ApiVehiclePostPatch;
  damage_severity?: ApiDamageSeverity;
  pricing?: ApiDamageSeverity;
}
