import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: Constants.manifest.extra.SENTRY_DSN,
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  enableInExpoDevelopment: true,
  tracesSampleRate: 1.0,
});

export default Sentry;
