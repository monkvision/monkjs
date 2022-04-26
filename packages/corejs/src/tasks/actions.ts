import slice from './index';

const { gotOne, gotMany, updatedOne, updatedMany, deletedOne, deleteMany, reset } = slice.actions;

export const gotOneTask = gotOne;

export const gotManyTasks = gotMany;

export const updatedOneTask = updatedOne;

export const updatedManyTasks = updatedMany;

export const deletedOneTask = deletedOne;

export const deleteManyTasks = deleteMany;

export const resetTasks = reset;
