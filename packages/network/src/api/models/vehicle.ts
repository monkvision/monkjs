import type { ApiAdditionalData } from './common';

export type ApiOwnerInfo = Record<string, unknown>;

export type ApiMileageUnit = 'km' | 'miles';

export type ApiMarketValueUnit = 'USD' | 'EUR';

export interface ApiMileageGet {
  mileage_value: number;
  mileage_unit: ApiMileageUnit;
}

export interface ApiMarketValueGet {
  market_value_value: number;
  market_value_unit: ApiMarketValueUnit;
}

export interface ApiVehicleComponent {
  additional_data?: ApiAdditionalData;
  brand?: string;
  car_registration?: boolean;
  color?: string;
  date_of_circulation?: string;
  deleted_at?: string;
  duplicate_keys?: boolean;
  expertise_requested?: boolean;
  exterior_cleanliness?: string;
  id: string;
  interior_cleanliness?: string;
  mileage?: ApiMileageGet;
  market_value?: ApiMarketValueGet;
  model?: string;
  serie?: string;
  owner_info?: ApiOwnerInfo;
  plate?: string;
  trade_in_offer?: number;
  vehicle_quotation?: number;
  vehicle_type?: string;
  vin?: string;
}

export interface ApiMileagePost {
  value: number;
  unit: ApiMileageUnit;
}

export interface ApiMarketValuePost {
  value: number;
  unit: ApiMarketValueUnit;
}

export interface ApiVehiclePostPatch {
  brand?: string;
  model?: string;
  plate?: string;
  vehicle_type?: string;
  mileage?: ApiMileagePost;
  market_value?: ApiMarketValuePost;
  serie?: string;
  vehicle_style?: string;
  vehicle_age?: string;
  vin?: string;
  color?: string;
  exterior_cleanliness?: string;
  interior_cleanliness?: string;
  date_of_circulation?: string;
  owner_info?: ApiOwnerInfo;
  duplicate_keys?: boolean;
  expertise_requested?: boolean;
  car_registration?: boolean;
  vehicle_quotation?: number;
  trade_in_offer?: number;
  additional_data?: ApiAdditionalData;
}
