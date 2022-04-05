import slice from './index';

const { gotOne, gotMany, updatedOne, updatedMany, deletedOne, deleteMany, reset } = slice.actions;

export const gotOneInspection = gotOne;

export const gotManyInspections = gotMany;

export const updatedOneInspection = updatedOne;

export const updatedManyInspections = updatedMany;

export const deletedOneInspection = deletedOne;

export const deleteManyInspections = deleteMany;

export const resetInspections = reset;
