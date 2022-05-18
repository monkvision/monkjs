/**
 * Application entity representing a vehicle that will be or has been part of an inspection.
 */
export interface Vehicle {
  /**
   * The id (uuid) of the vehicle entity.
   */
  id: string;
  /**
   * Creation date of the vehicle entity, in the ISO 8601 format.
   */
  createdAt?: string;
  /**
   * Deletion date of the vehicle entity (if it has been deleted), in the ISO 8601 format.
   */
  deletedAt?: string;
  /**
   * The estimate cost of the repairs if the vehicle needs some.
   */
  repairEstimate?: number;
  /**
   * The name of the brand of the vehicle.
   */
  brand?: string;
  /**
   * The name of the model of the vehicle.
   */
  model?: string;
  /**
   * The number / string present on the vehicle registration plate.
   */
  plate?: string;
  /**
   * The type of vehicle.
   */
  vehicleType?: string;
  /**
   * The serial number of the vehicle.
   */
  serie?: string;
  /**
   * The style of the vehicle.
   */
  vehicleStyle?: string;
  /**
   * The age of the vehicle.
   */
  vehiculeAge?: string;
  /**
   * The unit used for the mileage of the vehicle.
   */
  mileageUnit?: MileageUnit;
  /**
   * The amount of mileage of the vehicle.
   */
  mileageValue?: number;
  /**
   * The unit of the market value of the vehicle.
   */
  marketValueUnit?: string;
  /**
   * The amount of the market value of the vehicle.
   */
  marketValueValue?: number;
  /**
   * The vehicle identification number of the vehicle.
   */
  vin?: string;
  /**
   * The color of the vehicle.
   */
  color?: string;
  /**
   * The cleanliness of the exterior of the vehicle.
   */
  exteriorCleanliness?: string;
  /**
   * The cleanliness of the interior of the vehicle.
   */
  interiorCleanliness?: string;
  /**
   * The date at which the vehicle was put on circulation.
   */
  dateOfCirculation?: string;
  /**
   * TODO : Define this type.
   */
  ownerInfo?: unknown;
  /**
   * TODO : Label this field (and define its type ?).
   */
  additionalData?: unknown;
}

/**
 * Normalized application entity representing a vehicle that will be or has been part of an inspection.
 */
export type NormalizedVehicle = Vehicle;

/**
 * The possible units of vehicle mileage.
 *
 * *Swagger Schema Reference :* `MileageUnit`
 */
export enum MileageUnit {
  /**
   * Kilometers.
   */
  KM = 'km',
  /**
   * Miles.
   */
  MILES = 'miles',
}

/**
 * Object describing the mileage of a vehicle.
 *
 * *Swagger Schema Reference :* `Mileage`
 */
export interface Mileage {
  /**
   * The amount of mileage of the vehicle.
   */
  value: number;
  /**
   * The unit used for the mileage of the vehicle.
   */
  unit: MileageUnit;
}

/**
 * Object describing the market value of a vehicle.
 *
 * *Swagger Schema Reference :* `MarketValue`
 */
export interface MarketValue {
  /**
   * The amount of the market value of the vehicle.
   */
  value: number;
  /**
   * The unit of the market value of the vehicle.
   */
  unit: string;
}
