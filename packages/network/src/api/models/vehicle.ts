import type { ApiAdditionalData } from './common';

export type ApiOwnerInfo = Record<string, unknown>;

export type ApiMileageUnit = 'km' | 'miles';

export type ApiMarketValueUnit = 'USD' | 'EUR';

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
  market_value_unit?: ApiMarketValueUnit;
  market_value_value?: number;
  mileage_unit?: ApiMileageUnit;
  mileage_value?: number;
  model?: string;
  owner_info?: ApiOwnerInfo;
  plate?: string;
  trade_in_offer?: number;
  type?: string;
  vehicle_quotation?: number;
  vehicle_type?: string;
  vin?: string;
}
