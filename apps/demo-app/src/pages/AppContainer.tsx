import { PropsWithChildren } from 'react';
import { MonkThemeProvider, useMonkAppState, useMonkTheme } from '@monkvision/common';

function RootStylesContainer({ children }: PropsWithChildren<unknown>) {
  const { rootStyles } = useMonkTheme();

  return (
    <div className='app-container' style={rootStyles}>
      {children}
    </div>
  );
}

export function AppContainer({ children }: PropsWithChildren<unknown>) {
  const { config } = useMonkAppState();

  return (
    <MonkThemeProvider palette={config.palette}>
      <RootStylesContainer>{children}</RootStylesContainer>
    </MonkThemeProvider>
  );
}
