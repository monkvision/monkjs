import { createContext } from 'react';
import { MonkTheme } from '@monkvision/types';
import { createTheme } from './theme';

/**
 * A React Context that contains the current Monk theme.
 */
export const MonkThemeContext = createContext<MonkTheme>(createTheme());
