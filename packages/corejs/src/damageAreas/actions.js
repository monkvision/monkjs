import slice from './index';

const { gotOne, gotMany, updatedOne, updatedMany, deletedOne, deleteMany, reset } = slice.actions;

export const gotOneDamageArea = gotOne;

export const gotManyDamageAreas = gotMany;

export const updatedOneDamageArea = updatedOne;

export const updatedManyDamageAreas = updatedMany;

export const deletedOneDamageArea = deletedOne;

export const deleteManyDamageAreas = deleteMany;

export const resetDamageAreas = reset;
