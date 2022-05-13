import { CoreJsResponseWithId, IdResponse } from '../sharedTypes';
import { MarketValue, Mileage, Vehicle } from './entityTypes';

/**
 * The model used to create a new vehicle.
 *
 * *Swagger Schema References :* `VehiclePatch` & `VehiclePost`
 */
export type CreateUpdateVehicle = Pick<Vehicle,
'brand' |
'model' |
'plate' |
'vehicleType' |
'serie' |
'vehicleStyle' |
'vehiculeAge' |
'vin' |
'color' |
'exteriorCleanliness' |
'interiorCleanliness' |
'dateOfCirculation' |
'ownerInfo'
> & {
  /**
   * The mileage information of the vehicle.
   */
  mileage?: Mileage;
  /**
   * The market value information of the vehicle.
   */
  marketValue?: MarketValue;
};

/**
 * The details of a vehicle returned after updating it.
 */
export type UpdatedVehicle = Pick<Vehicle,
'id' |
'brand' |
'model' |
'plate' |
'vehicleType' |
'serie' |
'vehicleStyle' |
'vehiculeAge' |
'vin' |
'color' |
'exteriorCleanliness' |
'interiorCleanliness' |
'dateOfCirculation' |
'ownerInfo' |
'mileageUnit' |
'mileageValue' |
'marketValueUnit' |
'marketValueValue'
>;

/**
 * The type returned by the updateOneVehicle method.
 */
export type UpdateOneVehicleResponse = CoreJsResponseWithId<IdResponse<'id'>, string, 'id'>;
