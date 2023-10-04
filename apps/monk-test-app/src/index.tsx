import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { DebugMonitoringAdapter, MonitoringProvider } from '@monkvision/monitoring';

import './i18n';
// import { sentryMonitoringAdapter } from './sentry';
import { App } from './views';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <MonitoringProvider adapter={new DebugMonitoringAdapter()}>
      <App />
    </MonitoringProvider>
  </StrictMode>,
);
