jest.mock('../../src/state/context', () => ({
  MonkContext: {
    Provider: jest.fn(({ children }) => <>{children}</>),
  },
}));
jest.mock('../../src/state/reducer', () => ({
  monkReducer: jest.fn(),
}));
jest.mock('../../src/state/hooks', () => ({
  useMonkState: jest.fn(() => {
    throw new Error();
  }),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import {
  createEmptyMonkState,
  MonkContext,
  MonkProvider,
  monkReducer,
  MonkState,
  useMonkState,
} from '../../src';

const useReducerSpy = jest.spyOn(React, 'useReducer');

describe('MonkProvider component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display its children', () => {
    const childTestId = 'child-test-id';
    const { unmount } = render(
      <MonkProvider>
        <div data-testid={childTestId} />
      </MonkProvider>,
    );
    expect(screen.queryByTestId(childTestId)).not.toBeNull();
    unmount();
  });

  it('should pass the state and dispatch values from the Monk reducer to the context', () => {
    const { unmount } = render(<MonkProvider />);

    expect(useReducerSpy).toHaveBeenCalledTimes(1);
    const [state, dispatch] = useReducerSpy.mock.results[0].value;
    expectPropsOnChildMock(MonkContext.Provider, { value: { state, dispatch } });
    unmount();
  });

  it('should pass the monk reducer function to the useReducer hook', () => {
    const { unmount } = render(<MonkProvider />);

    expect(useReducerSpy).toHaveBeenCalledWith(monkReducer, expect.anything());
    unmount();
  });

  it('should pass an empty state if no initial state is provided', () => {
    const { unmount } = render(<MonkProvider />);

    expect(useReducerSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining(createEmptyMonkState()),
    );
    unmount();
  });

  it('should pass an initialized state with the value from the prop', () => {
    const initialState = {
      inspections: [{ id: 'test' }, { id: 'okay' }],
      tasks: [{ id: 'task' }],
    } as unknown as Partial<MonkState>;
    const { unmount } = render(<MonkProvider initialState={initialState} />);

    expect(useReducerSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ...createEmptyMonkState(),
        ...initialState,
      }),
    );
    unmount();
  });

  it('should no call the provider context if the Monk state is already defined', () => {
    (useMonkState as jest.Mock).mockImplementationOnce(() => {});
    const childTestId = 'child-test-id';
    const { unmount } = render(
      <MonkProvider>
        <div data-testid={childTestId} />
      </MonkProvider>,
    );

    expect(MonkContext.Provider).not.toHaveBeenCalled();
    expect(screen.queryByTestId(childTestId)).not.toBeNull();
    unmount();
  });
});
