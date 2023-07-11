import Constants from 'expo-constants';
import { name, version } from '@package/json';

const catConfig = {
  dsn: Constants.manifest.extra.SENTRY_DSN,
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  tracesSampleRate: 0.025,
  release: `${name}@${version}`,
  tracingOrigins: ['localhost', 'cna.dev.monk.ai', 'cna-staging.dev.monk.ai', 'cna.preview.monk.ai', 'cna.monk.ai'],
};

export default catConfig;
