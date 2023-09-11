import { SentryMonitoringAdapter } from '@monkvision/sentry';

export const sentryMonitoringAdapter = new SentryMonitoringAdapter({
  dsn: 'https://669efe3ef7b359aa4c4bdcf6761ba861@o4505669501648896.ingest.sentry.io/4505861275975680',
  environment: 'development',
  debug: true,
  tracesSampleRate: 0.025,
  release: '1.0',
});
