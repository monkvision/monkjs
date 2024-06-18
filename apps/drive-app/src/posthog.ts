import { PosthogAnalyticsAdapter } from '@monkvision/posthog';
import { getEnvOrThrow } from '@monkvision/common';

export const posthogAnalyticsAdapter = new PosthogAnalyticsAdapter({
  token: 'phc_f1KJvZbcPCo8lsMBb63B6d9BxqKcjPdldFu5Nftywi1',
  api_host: 'https://eu.posthog.com',
  environnement: getEnvOrThrow('REACT_APP_ENVIRONMENT'),
  projectName: 'drive-app',
  release: '1.0.0',
});
