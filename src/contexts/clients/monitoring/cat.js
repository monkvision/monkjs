import Constants from 'expo-constants';
import { name, version } from '@package/json';

const catConfig = {
  dsn: 'https://897e91ecb775eeea766299dfb3587317@o4505568095109120.ingest.sentry.io/4505622371696640',
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  tracesSampleRate: 0.025,
  release: `${name}@${version}`,
  tracingOrigins: ['localhost'],
};

export default catConfig;
