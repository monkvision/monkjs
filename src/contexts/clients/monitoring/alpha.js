import Constants from 'expo-constants';
import { name, version } from '@package/json';

const alphaConfig = {
  dsn: 'https://723118e6e7b146317643c7a6ecd60d85@o4505669501648896.ingest.sentry.io/4505673897345024',
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  tracesSampleRate: 0.025,
  release: `${name}@${version}`,
  tracingOrigins: ['localhost'],
};

export default alphaConfig;
