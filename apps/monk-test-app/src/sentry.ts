import { SentryMonitoringAdapter } from '@monkvision/sentry';

export const sentryMonitoringAdapter = new SentryMonitoringAdapter({
  dsn: 'https://db38973466bcef38767064fd025e20c6@o4505669501648896.ingest.sentry.io/4505673881092096',
  environment: 'development',
  debug: true,
  tracesSampleRate: 0.025,
  release: '1.0',
});
