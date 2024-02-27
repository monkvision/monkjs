jest.mock('../../src/state/actions', () => ({
  isCreatedOneImageAction: jest.fn(() => false),
  isGotOneInspectionAction: jest.fn(() => false),
  isResetStateAction: jest.fn(() => false),
  isUpdatedManyTasksAction: jest.fn(() => false),
  createdOneImage: jest.fn(() => null),
  gotOneInspection: jest.fn(() => null),
  resetState: jest.fn(() => null),
  updatedManyTasks: jest.fn(() => null),
}));

import {
  createdOneImage,
  gotOneInspection,
  isCreatedOneImageAction,
  isGotOneInspectionAction,
  isResetStateAction,
  isUpdatedManyTasksAction,
  MonkAction,
  monkReducer,
  MonkState,
  resetState,
  updatedManyTasks,
} from '../../src';

const actions = [
  { matcher: isResetStateAction, handler: resetState, noParams: true },
  { matcher: isGotOneInspectionAction, handler: gotOneInspection },
  { matcher: isCreatedOneImageAction, handler: createdOneImage },
  { matcher: isUpdatedManyTasksAction, handler: updatedManyTasks },
] as unknown as { matcher: jest.Mock; handler: jest.Mock; noParams?: boolean }[];

describe('Monk state reducer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should properly call the action matchers and helpers for each action type', () => {
    actions.forEach((availableAction) => {
      const newState = { test: 'hello' };
      availableAction.matcher.mockImplementationOnce(() => true);
      availableAction.handler.mockImplementationOnce(() => newState);
      const state = { mock: 'state' } as unknown as MonkState;
      const action = { fake: 'action' } as unknown as MonkAction;
      const result = monkReducer(state, action);
      expect(availableAction.matcher).toHaveBeenCalledWith(action);
      const params = availableAction.noParams ? [] : [state, action];
      expect(availableAction.handler).toHaveBeenCalledWith(...params);
      expect(result).toEqual(newState);
    });
  });
});
