import { createEmptyMonkState, isResetStateAction, MonkActionType, resetState } from '../../../src';

describe('ResetState action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isResetStateAction({ type: MonkActionType.RESET_STATE })).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isResetStateAction({ type: MonkActionType.GOT_ONE_INSPECTION })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new empty state', () => {
      expect(resetState()).toEqual(createEmptyMonkState());
    });
  });
});
