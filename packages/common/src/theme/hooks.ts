import { useContext } from 'react';
import { MonkTheme } from '@monkvision/types';
import { MonkThemeContext } from './context';

/**
 * Custom hook that allows you to access the current Monk theme used by the application.
 */
export function useMonkTheme(): MonkTheme {
  return useContext(MonkThemeContext);
}
