import Constants from 'expo-constants';
import { name, version } from '@package/json';

const fastbackConfig = {
  dsn: 'https://89c3d33723b77db216379592144efd47@o4505669501648896.ingest.sentry.io/4505673902260224',
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  tracesSampleRate: 0.025,
  release: `${name}@${version}`,
  tracingOrigins: ['localhost'],
};

export default fastbackConfig;
