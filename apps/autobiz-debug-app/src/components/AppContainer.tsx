import { PropsWithChildren } from 'react';
import { MonkThemeProvider, useMonkTheme } from '@monkvision/common';

function RootStylesContainer({ children }: PropsWithChildren<unknown>) {
  const { rootStyles } = useMonkTheme();

  return (
    <div className='app-container' style={rootStyles}>
      {children}
    </div>
  );
}

export function AppContainer({ children }: PropsWithChildren<unknown>) {
  return (
    <MonkThemeProvider>
      <RootStylesContainer>{children}</RootStylesContainer>
    </MonkThemeProvider>
  );
}
