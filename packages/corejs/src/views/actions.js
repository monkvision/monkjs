import slice from './index';

const { gotOne, gotMany, updatedOne, updatedMany, deletedOne, deleteMany, reset } = slice.actions;

export const gotOneView = gotOne;

export const gotManyViews = gotMany;

export const updatedOneView = updatedOne;

export const updatedManyViews = updatedMany;

export const deletedOneView = deletedOne;

export const deleteManyViews = deleteMany;

export const resetViews = reset;
