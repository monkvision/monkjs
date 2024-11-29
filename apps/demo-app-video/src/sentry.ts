import { SentryMonitoringAdapter } from '@monkvision/sentry';
import { getEnvOrThrow } from '@monkvision/common';

export const sentryMonitoringAdapter = new SentryMonitoringAdapter({
  dsn: getEnvOrThrow('REACT_APP_SENTRY_DSN'),
  environment: getEnvOrThrow('REACT_APP_ENVIRONMENT'),
  debug: process.env['REACT_APP_SENTRY_DEBUG'] === 'true',
  tracesSampleRate: 0.025,
  release: '1.0',
});
