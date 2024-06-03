import { SentryMonitoringAdapter } from '@monkvision/sentry';
import { getEnvOrThrow } from '@monkvision/common';

export const sentryMonitoringAdapter = new SentryMonitoringAdapter({
  dsn: 'https://74f50bfe6f11de7aefd54acfa5dfed96@o4505669501648896.ingest.us.sentry.io/4506863461662720',
  environment: getEnvOrThrow('REACT_APP_ENVIRONMENT'),
  debug: process.env['REACT_APP_SENTRY_DEBUG'] === 'true',
  tracesSampleRate: 0.025,
  release: '1.0',
});
