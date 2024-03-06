import { createContext, Dispatch } from 'react';
import { MonkAction } from './actions';
import { MonkState } from './state';

/**
 * An object that wraps the Monk state as well as its dispatch function.
 */
export interface MonkStateWithDispatch {
  /**
   * The state of all the Monk entities.
   */
  state: MonkState;
  /**
   * The dispatch function used to dispatch actions to modify the state.
   */
  dispatch: Dispatch<MonkAction>;
}

/**
 * A React Context that contains the Monk state as well as its dispatch function. If no MonkProvider was defined above,
 * the default value is `null`.
 */
export const MonkContext = createContext<MonkStateWithDispatch | null>(null);
