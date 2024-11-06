import ReactDOM from 'react-dom';
import { MonitoringProvider } from '@monkvision/monitoring';
import { AnalyticsProvider } from '@monkvision/analytics';
import { sentryMonitoringAdapter } from './sentry';
import { posthogAnalyticsAdapter } from './posthog';
import { AppRouter } from './components';
import './index.css';

ReactDOM.render(
  <MonitoringProvider adapter={sentryMonitoringAdapter}>
    <AnalyticsProvider adapter={posthogAnalyticsAdapter}>
      <AppRouter />
    </AnalyticsProvider>
  </MonitoringProvider>,
  document.getElementById('root'),
);
