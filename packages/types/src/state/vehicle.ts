import { AdditionalData, CurrencyCode } from './common';
import { MonkEntity, MonkEntityType } from './entity';

/**
 * Enumeration of the units used for the mileage of a vehicle.
 */
export enum MileageUnit {
  KM = 'km',
  MILES = 'miles',
}

/**
 * An object containing all the information about a vehicle that is being inspected during an inspection.
 */
export interface Vehicle extends MonkEntity {
  /**
   * The type of the entity.
   */
  entityType: MonkEntityType.VEHICLE;
  /**
   * The brand of the vehicle.
   */
  brand?: string;
  /**
   * The model of the vehicle.
   */
  model?: string;
  /**
   * The license plate number of the vehicle.
   */
  plate?: string;
  /**
   * The type of the vehicle (SUV, Minivan etc.).
   */
  type?: string;
  /**
   * The unit of the vehicle's mileage.
   */
  mileageUnit?: MileageUnit;
  /**
   * The mileage of the vehicle.
   */
  mileageValue?: number;
  /**
   * The unit of the vehicle's market value.
   */
  marketValueUnit?: CurrencyCode;
  /**
   * The market value of the vehicle.
   */
  marketValue?: number;
  /**
   * The VIN (Vehicle Identification Number) of the vehicle.
   */
  vin?: string;
  /**
   * The color of the vehicle.
   */
  color?: string;
  /**
   * The exterior cleanliness of the vehicle.
   */
  exteriorCleanliness?: string;
  /**
   * The interior cleanliness of the vehicle.
   */
  interior_cleanliness?: string;
  /**
   * The date of circulation of the vehicle.
   */
  dateOfCirculation?: string;
  /**
   * Indicates if the vehicle keys are duplicate or not.
   */
  duplicateKeys?: boolean;
  /**
   * Indicates if the vehicle needs expertise or not.
   */
  expertiseRequested?: boolean;
  /**
   * Indicates if the vehicle has been registered or not.
   */
  carRegistration?: boolean;
  /**
   * The quotation of the vehicle.
   */
  vehicleQuotation?: number;
  /**
   * The amount of the trade in offer if there is one.
   */
  tradeInOffer?: number;
  /**
   * Information about the owner of the vehicle.
   */
  ownerInfo?: Record<string, unknown>;
  /**
   * Additional data added during the creation of the inspection.
   */
  additionalData?: AdditionalData;
}
