import { Outlet } from 'react-router-dom';
import classnames from 'classnames';
import { MonkApplicationStateProvider, useMonkTheme } from '@monkvision/common';
import { Navbar } from './Navbar';
import { useFullscreenRoute } from '../hooks';

export function App() {
  console.log('App rendered');
  const isFullscreenRoute = useFullscreenRoute();
  const { rootStyles } = useMonkTheme();

  return (
    <MonkApplicationStateProvider fetchFromSearchParams={false}>
      <div className='app-container' style={rootStyles}>
        {!isFullscreenRoute && <Navbar />}
        <div className={classnames('content-container', { fullscreen: isFullscreenRoute })}>
          <Outlet />
        </div>
      </div>
    </MonkApplicationStateProvider>
  );
}
