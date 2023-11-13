import { DebugMonitoringAdapter, MonitoringProvider } from '@monkvision/monitoring';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import './i18n';
import './index.css';
// import { sentryMonitoringAdapter } from './sentry';
import { App } from './views';

ReactDOM.render(
  <StrictMode>
    <MonitoringProvider adapter={new DebugMonitoringAdapter()}>
      <App />
    </MonitoringProvider>
  </StrictMode>,
  document.getElementById('root'),
);
