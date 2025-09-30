jest.mock('react');

import React from 'react';
import { MonkContext, createEmptyMonkState, MonkStateWithDispatch, useMonkState } from '../../src';

describe('useMonkState hook', () => {
  it('should return the MonkContext', () => {
    const context: MonkStateWithDispatch = {
      state: createEmptyMonkState(),
      dispatch: () => {},
    };
    (React.useContext as jest.Mock).mockImplementation(() => context);
    const spy = jest.spyOn(React, 'useContext');

    const stateWithDispatch = useMonkState();

    expect(spy).toHaveBeenCalledWith(MonkContext);
    expect(stateWithDispatch).toBe(context);
  });

  it('should throw an error if the MonkContext is not initialized', () => {
    (React.useContext as jest.Mock).mockImplementation(() => null);

    expect(() => useMonkState()).toThrow();
  });
});
