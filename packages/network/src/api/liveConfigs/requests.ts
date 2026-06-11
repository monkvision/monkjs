import { LiveConfig } from '@monkvision/types';
import ky from 'ky';
import { getDefaultOptions } from '../config';

const LIVE_CONFIG_BASE_URL =
  process.env['REACT_APP_LIVE_CONFIG_BASE_URL'] ??
  'https://storage.googleapis.com/monk-front-public/live-configurations';

const isGcs = LIVE_CONFIG_BASE_URL.startsWith('https://storage.googleapis.com');

/**
 * Fetch a webapp live configuration from the API.
 *
 * @param id The ID of the live config to get.
 */
export async function getLiveConfig(id: string): Promise<LiveConfig> {
  const url = `${LIVE_CONFIG_BASE_URL}/${id}.json?nocache=${Date.now()}`;
  // GCS does not accept Monk API request headers (e.g. access-control-allow-origin).
  // Skip getDefaultOptions() to avoid a CORS preflight rejection on the GCS bucket.
  const response = isGcs ? await ky.get(url) : await ky.get(url, getDefaultOptions());
  return response.json<LiveConfig>();
}
