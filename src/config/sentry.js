import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';
import { CaptureConsole } from '@sentry/integrations';
import { Platform } from 'react-native';

Sentry.init({
  dsn: Constants.manifest.extra.SENTRY_DSN,
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  enableInExpoDevelopment: true,
  tracesSampleRate: 1.0,
  ...Platform.select({
    web: {
      integrations: [new CaptureConsole({ levels: ['log'] })],
    },
  }),
});

export default Sentry;
