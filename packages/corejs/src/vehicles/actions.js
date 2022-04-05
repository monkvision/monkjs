import slice from './index';

const { gotOne, gotMany, updatedOne, updatedMany, deletedOne, deleteMany, reset } = slice.actions;

export const gotOneVehicle = gotOne;

export const gotManyVehicles = gotMany;

export const updatedOneVehicle = updatedOne;

export const updatedManyVehicles = updatedMany;

export const deletedOneVehicle = deletedOne;

export const deleteManyVehicles = deleteMany;

export const resetVehicles = reset;
