import React from 'react';
import ReactDOM from 'react-dom/client';
import { SentryMonitoringAdapter } from '@monkvision/sentry';
import { MonitoringProvider } from '@monkvision/monitoring';

import './index.css';
import App from './App';

const adapter = new SentryMonitoringAdapter({
  dsn: 'https://db38973466bcef38767064fd025e20c6@o4505669501648896.ingest.sentry.io/4505673881092096',
  environment: 'development',
  debug: true,
  tracesSampleRate: 0.025,
  release: 'Refactor Application 1.0',
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <MonitoringProvider adapter={adapter}>
      <App />
    </MonitoringProvider>
  </React.StrictMode>,
);
