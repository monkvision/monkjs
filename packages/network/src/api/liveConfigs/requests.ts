import { LiveConfig } from '@monkvision/types';
import ky from 'ky';
import { getDefaultOptions } from '../config';

/**
 * Fetch a webapp live configuration from the API.
 *
 * @param id The ID of the live config to get.
 */
export async function getLiveConfig(id: string): Promise<LiveConfig> {
  const kyOptions = getDefaultOptions();
  const response = await ky.get(
    `https://storage.googleapis.com/monk-front-public/live-configurations/${id}.json?nocache=${Date.now()}`,
    kyOptions,
  );
  return response.json<LiveConfig>();
}
