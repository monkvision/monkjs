import { PosthogAnalyticsAdapter } from '@monkvision/posthog';
import { getEnvOrThrow } from '@monkvision/common';

export const posthogAnalyticsAdapter = new PosthogAnalyticsAdapter({
  token: 'phc_9mKWu5rYzvrUT6Bo3bTzrclNa5sOILKthH9BA9sna0M',
  api_host: 'https://eu.posthog.com',
  environnement: getEnvOrThrow('VITE_ENVIRONMENT'),
  projectName: 'demo-app',
  release: '1.0.0',
});
