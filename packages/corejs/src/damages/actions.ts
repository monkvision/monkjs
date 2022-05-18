import slice from './index';

const { gotOne, gotMany, updatedOne, updatedMany, deletedOne, deleteMany, reset } = slice.actions;

export const gotOneDamage = gotOne;

export const gotManyDamages = gotMany;

export const updatedOneDamage = updatedOne;

export const updatedManyDamages = updatedMany;

export const deletedOneDamage = deletedOne;

export const deleteManyDamages = deleteMany;

export const resetDamages = reset;
