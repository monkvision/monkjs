import * as SentryReactNative from '@sentry/react-native';
import Constants from 'expo-constants';
// import isEmpty from 'lodash.isempty';
import * as Sentry from 'sentry-expo';

const dsn = Constants.manifest.extra.SENTRY_DSN_REACT_NATIVE;
Sentry.init({
  dsn,
  enableInExpoDevelopment: true,
  debug: true,
});

// The @sentry/react-native package doesn't work well on expo, that's why we shall switch to
// sentry-expo package, which works fine, but we always have warnings and errors, TO BE FIXED
// if (!isEmpty(dsn)) {
//   SentryReactNative.init({
//     dsn,
//     // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
//     // We recommend adjusting this value in production.
//     tracesSampleRate: 1.0,
//   });
// }

export default SentryReactNative;
