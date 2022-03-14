import Constants from 'expo-constants';
import monk from '@monkvision/corejs';

const axiosConfig = {
  baseURL: `https://${Constants.manifest.extra.API_DOMAIN}`,
  headers: { 'Access-Control-Allow-Origin': '*' },
};

const authConfig = {
  domain: Constants.manifest.extra.AUTH_DOMAIN,
  audience: Constants.manifest.extra.AUTH_AUDIENCE,
  clientId: Constants.manifest.extra.AUTH_CLIENT_ID,
};

monk.config.axiosConfig = axiosConfig;
monk.config.authConfig = authConfig;
