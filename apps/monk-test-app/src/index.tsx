import React from 'react';
import ReactDOM from 'react-dom/client';
import { SentryMonitoringAdapter } from '@monkvision/sentry';
import { MonitoringProvider } from '@monkvision/monitoring';

import './index.css';
import App from './App';

const adapter = new SentryMonitoringAdapter({
  dsn: 'https://9daf5f76b1d7190d75eb25f7cafea2f2@o4505568095109120.ingest.sentry.io/4505662672076810',
  environment: 'development',
  debug: true,
  tracesSampleRate: 0.025,
  release: 'Refactor Application 1.0',
  tracingOrigins: ['localhost'],
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <MonitoringProvider adapter={adapter}>
      <App />
    </MonitoringProvider>
  </React.StrictMode>,
);
