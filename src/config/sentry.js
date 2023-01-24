import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';
import { CaptureConsole } from '@sentry/integrations';
import { Platform } from 'react-native';

import { Tracing } from './sentryPlatform';

// eslint-disable-next-line max-len
const tracingOrigins = ['localhost', 'cna.dev.monk.ai', 'cna.staging.monk.ai', 'cna.preview.monk.ai', 'cna.monk.ai'];

Sentry.init({
  dsn: Constants.manifest.extra.SENTRY_DSN,
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  enableAutoSessionTracking: true,
  enableInExpoDevelopment: true,
  sessionTrackingIntervalMillis: 10000,
  tracesSampleRate: Constants.manifest.extra.ENV !== 'production' ? 1.0 : 0.2,
  integrations: [
    ...(Platform.select({ web: [new CaptureConsole({ levels: ['log'] })], native: [] })),
    new Tracing({
      tracingOrigins,
    }),
  ],
});

export default Sentry;
