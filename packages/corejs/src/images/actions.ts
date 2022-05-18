import slice from './index';

const { gotOne, gotMany, updatedOne, updatedMany, deletedOne, deleteMany, reset } = slice.actions;

export const gotOneImage = gotOne;

export const gotManyImages = gotMany;

export const updatedOneImage = updatedOne;

export const updatedManyImages = updatedMany;

export const deletedOneImage = deletedOne;

export const deleteManyImages = deleteMany;

export const resetImages = reset;
