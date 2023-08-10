import Constants from 'expo-constants';
import { name, version } from '@package/json';

const catConfig = {
  dsn: 'https://9f3c95329f49cd9ae1241bf836e67056@o4505669501648896.ingest.sentry.io/4505673899048960',
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  tracesSampleRate: 0.025,
  release: `${name}@${version}`,
  tracingOrigins: ['localhost'],
};

export default catConfig;
