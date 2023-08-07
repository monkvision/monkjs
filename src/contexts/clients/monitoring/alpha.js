import Constants from 'expo-constants';
import { name, version } from '@package/json';

const alphaConfig = {
  dsn: 'https://43eff3005b2ff287a354dd90562d10da@o4505568095109120.ingest.sentry.io/4505622369337344',
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  tracesSampleRate: 0.025,
  release: `${name}@${version}`,
  tracingOrigins: ['localhost'],
};

export default alphaConfig;
