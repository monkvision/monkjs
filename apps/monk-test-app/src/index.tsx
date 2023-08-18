import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { SentryMonitoringAdapter } from '@monkvision/sentry';
import { MonitoringProvider } from '@monkvision/monitoring';

import App from './App';
import './index.css';

const adapter = new SentryMonitoringAdapter({
  dsn: 'https://db38973466bcef38767064fd025e20c6@o4505669501648896.ingest.sentry.io/4505673881092096',
  environment: 'development',
  debug: true,
  tracesSampleRate: 0.025,
  release: '1.0',
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <MonitoringProvider adapter={adapter}>
      <App />
    </MonitoringProvider>
  </StrictMode>,
);
