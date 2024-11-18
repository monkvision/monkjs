import { Vehicle } from '@monkvision/types';
import { ApiVehiclePostPatch } from '../models';

export function mapApiVehiclePatch(options: Partial<Vehicle>): ApiVehiclePostPatch {
  return {
    brand: options.brand,
    model: options.model,
    plate: options.plate,
    vehicle_type: options.type,
    mileage:
      options.mileageValue && options.mileageUnit
        ? {
            mileage_value: options.mileageValue,
            mileage_unit: options.mileageUnit,
          }
        : undefined,
    market_value:
      options.marketValue && options.marketValueUnit
        ? { market_value_value: options.marketValue, market_value_unit: options.marketValueUnit }
        : undefined,
    vin: options.vin,
    color: options.color,
    exterior_cleanliness: options.exteriorCleanliness,
    interior_cleanliness: options.interiorCleanliness,
    date_of_circulation: options.dateOfCirculation,
    duplicate_keys: options.duplicateKeys,
    expertise_requested: options.expertiseRequested,
    car_registration: options.carRegistration,
    vehicle_quotation: options.vehicleQuotation,
    trade_in_offer: options.tradeInOffer,
    owner_info: options.ownerInfo,
  };
}
