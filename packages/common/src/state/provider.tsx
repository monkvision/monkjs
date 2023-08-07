import React, { PropsWithChildren, useReducer } from 'react';
import { MonkContext } from './context';
import { useMonkState } from './hooks';
import { monkReducer } from './reducer';
import { MonkState } from './state';

/**
 * Creates an empty state that can be used to initialize the Monk state.
 */
export function createEmptyMonkState(): MonkState {
  return {
    damages: [],
    images: [],
    inspections: [],
    parts: [],
    partOperations: [],
    severityResults: [],
    tasks: [],
    vehicles: [],
    wheelAnalysis: [],
  };
}

/**
 * Prop types of the MonkProvider component.
 */
export interface MonkProviderProps {
  /**
   * Optional initial state that you can pass to the MonkProvider component.
   */
  initialState?: Partial<MonkState>;
}

/**
 * Context provider for the Monk Context. Place this at the root of your application in order to initialize the Monk
 * state in your app and get access to the dispatch function.
 *
 * ***Important Note :*** If this provider component is placed in a component which is already a child of a
 * MonkProvider, this provider will have no effect. Only the FIRST MonkProvider has any effect.
 */
export function MonkProvider({ initialState, children }: PropsWithChildren<MonkProviderProps>) {
  const [state, dispatch] = useReducer(monkReducer, {
    ...createEmptyMonkState(),
    ...initialState,
  });

  try {
    useMonkState();
    return <>{children}</>;
  } catch (err) {
    return <MonkContext.Provider value={{ state, dispatch }}>{children}</MonkContext.Provider>;
  }
}
