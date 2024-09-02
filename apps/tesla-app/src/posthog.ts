import { PosthogAnalyticsAdapter } from '@monkvision/posthog';
import { getEnvOrThrow } from '@monkvision/common';

export const posthogAnalyticsAdapter = new PosthogAnalyticsAdapter({
  token: '',
  api_host: 'https://eu.posthog.com',
  environnement: getEnvOrThrow('REACT_APP_ENVIRONMENT'),
  projectName: 'demo-app',
  release: '1.0.0',
});
