import Constants from 'expo-constants';
import { name, version } from '@package/json';

const fastbackConfig = {
  dsn: 'https://6761bb83748b010e89ecef755c368779@o4505568095109120.ingest.sentry.io/4505622375563264',
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  tracesSampleRate: 0.025,
  release: `${name}@${version}`,
  tracingOrigins: ['localhost'],
};

export default fastbackConfig;
