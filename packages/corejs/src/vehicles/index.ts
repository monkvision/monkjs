import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { isEmpty, snakeCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep-lodash';

import { normalize } from 'normalizr';
import config from '../config';

import createEntityReducer from '../createEntityReducer';
import { InspectionPayloadTypes } from '../inspections/reduxTypes';
import { IdResponse, RootState } from '../sharedTypes';
import { NormalizedTask } from '../tasks/entityTypes';
import { CreateUpdateVehicle, UpdatedVehicle, UpdateOneVehicleResponse } from './apiTypes';
import { NormalizedVehicle } from './entityTypes';

import schema, { idAttribute, key } from './schema';

function mapUpdatedVehicle(id: string, updateVehicle: CreateUpdateVehicle): UpdatedVehicle {
  return {
    id,
    brand: updateVehicle.brand,
    model: updateVehicle.model,
    plate: updateVehicle.plate,
    vehicleType: updateVehicle.vehicleType,
    serie: updateVehicle.serie,
    vehicleStyle: updateVehicle.vehicleStyle,
    vehiculeAge: updateVehicle.vehiculeAge,
    vin: updateVehicle.vin,
    color: updateVehicle.color,
    exteriorCleanliness: updateVehicle.exteriorCleanliness,
    interiorCleanliness: updateVehicle.interiorCleanliness,
    dateOfCirculation: updateVehicle.dateOfCirculation,
    ownerInfo: updateVehicle.ownerInfo,
    mileageUnit: updateVehicle.mileage.unit,
    mileageValue: updateVehicle.mileage.value,
    marketValueUnit: updateVehicle.marketValue.unit,
    marketValueValue: updateVehicle.marketValue.value,
  };
}

/**
 * Update the details of a vehicle.
 *
 * @param {string} inspectionId The id of the inspection.
 * @param {CreateUpdateVehicle} updateVehicle The new details of the vehicle.
 */
export async function updateOne(
  inspectionId: string,
  updateVehicle: CreateUpdateVehicle,
): Promise<UpdateOneVehicleResponse> {
  const axiosResponse = await axios.request<IdResponse<'id'>>({
    ...config.axiosConfig,
    method: 'patch',
    url: `/inspections/${inspectionId}/vehicle`,
    data: mapKeysDeep(updateVehicle, (v, k) => snakeCase(k)),
  });

  const id = axiosResponse.data[idAttribute];
  const updatedVehicle = mapUpdatedVehicle(id, updateVehicle);

  return ({
    axiosResponse,
    [idAttribute]: id,
    ...normalize(updatedVehicle, schema),
  });
}

export const entityAdapter = createEntityAdapter<NormalizedVehicle>({});
export const entityReducer = createEntityReducer(key, entityAdapter);
export const selectors = entityAdapter.getSelectors((state: RootState) => state[key]);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
  extraReducers: (builder) => {
    builder.addCase('inspections/gotOne', (
      state: EntityState<NormalizedTask>,
      action: PayloadAction<InspectionPayloadTypes['GotOne'], 'inspections/gotOne'>,
    ) => {
      const { entities } = action.payload;
      const vehicles = entities[key];
      if (!isEmpty(vehicles)) { entityAdapter.upsertMany(state, vehicles); }
    }).addCase('inspections/gotMany', (
      state: EntityState<NormalizedTask>,
      action: PayloadAction<InspectionPayloadTypes['GotMany'], 'inspections/gotMany'>,
    ) => {
      const { entities } = action.payload;
      const vehicles = entities[key];
      if (!isEmpty(vehicles)) { entityAdapter.upsertMany(state, vehicles); }
    });
  },
});
