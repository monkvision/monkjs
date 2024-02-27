import type { ApiAdditionalData } from './common';
import type { ApiDamages } from './damage';
import type { ApiImages } from './image';
import type { ApiParts } from './part';
import type { ApiPricingV2 } from './pricingV2';
import type { ApiSeverityResults } from './severityResult';
import type { ApiTasks } from './task';
import type { ApiVehicleComponent } from './vehicle';
import type { ApiWheelAnalysis } from './wheelAnalysis';

export interface ApiInspectionGet {
  additional_data?: ApiAdditionalData;
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
