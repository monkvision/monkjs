import { PropsWithChildren } from 'react';
import { useMonkTheme } from '@monkvision/common';

export function AppContainer({ children }: PropsWithChildren<unknown>) {
  const { rootStyles } = useMonkTheme();

  return (
    <div className='app-container' style={rootStyles}>
      {children}
    </div>
  );
}
