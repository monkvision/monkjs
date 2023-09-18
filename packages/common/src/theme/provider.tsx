import { MonkPalette } from '@monkvision/types';
import React, { PropsWithChildren, useMemo } from 'react';
import { MonkThemeContext } from './context';
import { createTheme } from './theme';

/**
 * Props given to the MonkThemeProvider component.
 */
export interface MonkThemeProviderProps {
  /**
   * Partial or complete color palette to be used in the app.
   */
  palette?: Partial<MonkPalette>;
}

/**
 * Context provider for the MonkTheme Context. Place this at the root of your application in order to initialize the
 * Monk theme in your app and get access to the theme and utility functions.
 */
export function MonkThemeProvider({
  palette,
  children,
}: PropsWithChildren<MonkThemeProviderProps>) {
  const theme = useMemo(() => createTheme({ palette }), [palette]);

  return <MonkThemeContext.Provider value={theme}>{children}</MonkThemeContext.Provider>;
}
