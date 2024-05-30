import { PosthogAnalyticsAdapter } from '@monkvision/posthog';

export const posthogAnalyticsAdapter = new PosthogAnalyticsAdapter({
  token: 'phc_azbiXVxUvUjxUAVLb5zrrlzNCFpf0RSClkiJ9RxTDGU',
  api_host: 'https://eu.posthog.com',
  environnement: 'development',
  projectName: 'renault',
  release: '1.0.0',
});
