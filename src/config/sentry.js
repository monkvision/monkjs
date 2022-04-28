import * as SentryReact from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import Constants from 'expo-constants';
import isEmpty from 'lodash.isempty';

const dsn = Constants.manifest.extra.SENTRY_DSN_REACT;

if (!isEmpty(dsn)) {
  SentryReact.init({
    dsn: Constants.manifest.extra.SENTRY,
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
  });
}

export default SentryReact;
