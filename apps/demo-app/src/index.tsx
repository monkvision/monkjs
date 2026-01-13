import { createRoot } from 'react-dom/client';
import { MonitoringProvider } from '@monkvision/monitoring';
import { AnalyticsProvider } from '@monkvision/analytics';
import { AuthProvider } from '@monkvision/network';
import { sentryMonitoringAdapter } from './sentry';
import { posthogAnalyticsAdapter } from './posthog';
import { AppRouter } from './components';
import { authConfigs } from './auth';
import './index.css';
import './i18n';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found.');
}
const root = createRoot(container);
root.render(
  <MonitoringProvider adapter={sentryMonitoringAdapter}>
    <AnalyticsProvider adapter={posthogAnalyticsAdapter}>
      <AuthProvider configs={authConfigs}>
        <AppRouter />
      </AuthProvider>
    </AnalyticsProvider>
  </MonitoringProvider>,
);
