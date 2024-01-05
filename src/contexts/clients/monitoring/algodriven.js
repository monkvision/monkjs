import Constants from 'expo-constants';
import { name, version } from '@package/json';

const algoDrivenConfig = {
  dsn: 'https://55526c1621ef0a5b42c0e0d89eae3b3f@o4505669501648896.ingest.sentry.io/4506511256846336',
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  tracesSampleRate: 0.025,
  release: `${name}@${version}`,
  tracingOrigins: ['localhost'],
};

export default algoDrivenConfig;
