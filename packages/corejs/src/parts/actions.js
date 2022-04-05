import slice from './index';

const { gotOne, gotMany, updatedOne, updatedMany, deletedOne, deleteMany, reset } = slice.actions;

export const gotOnePart = gotOne;

export const gotManyParts = gotMany;

export const updatedOnePart = updatedOne;

export const updatedManyParts = updatedMany;

export const deletedOnePart = deletedOne;

export const deleteManyParts = deleteMany;

export const resetParts = reset;
