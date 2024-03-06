import { useContext } from 'react';
import { MonkContext, MonkStateWithDispatch } from './context';

/**
 * Custom hook that allows you to access the Monk State Context methods inside a component.
 *
 * Note : If this hook is called inside a component that is not a child of a MonkProvider component, it will throw an
 * error.
 */
export function useMonkState(): MonkStateWithDispatch {
  const stateWithDispatch = useContext(MonkContext);

  if (!stateWithDispatch) {
    throw new Error(
      'MonkContext not initialized! Did you make a call to `useMonkState()` without initializing the MonkContext in a parent component?',
    );
  }

  return stateWithDispatch;
}
