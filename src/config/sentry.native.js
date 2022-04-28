import * as SentryReactNative from '@sentry/react-native';
import Constants from 'expo-constants';
import isEmpty from 'lodash.isempty';

const dsn = Constants.manifest.extra.SENTRY_DSN_REACT_NATIVE;

if (!isEmpty(dsn)) {
  SentryReactNative.init({
    dsn: Constants.manifest.extra.SENTRY,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
  });
}

export default SentryReactNative;
