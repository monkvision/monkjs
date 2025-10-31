import ReactDOM from 'react-dom';
import { MonitoringProvider } from '@monkvision/monitoring';
import { AnalyticsProvider } from '@monkvision/analytics';
import { AuthProvider } from '@monkvision/network';
import { sentryMonitoringAdapter } from './sentry';
import { posthogAnalyticsAdapter } from './posthog';
import { AppRouter } from './components';
import { authConfigs } from './auth';
import './index.css';
import './i18n';

ReactDOM.render(
  <MonitoringProvider adapter={sentryMonitoringAdapter}>
    <AnalyticsProvider adapter={posthogAnalyticsAdapter}>
      <AuthProvider configs={authConfigs}>
        <AppRouter />
      </AuthProvider>
    </AnalyticsProvider>
  </MonitoringProvider>,
  document.getElementById('root'),
);
