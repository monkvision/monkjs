import { AuthorizationParams } from '@auth0/auth0-react';
import { getEnvOrThrow } from '@monkvision/common';
import { AuthConfig } from '@monkvision/network';

export const AUTHORIZATION_PARAMS: AuthorizationParams = {
  redirect_uri: window.location.origin,
  audience: getEnvOrThrow('VITE_AUTH_AUDIENCE'),
  prompt: 'login',
};

export const authConfigs: AuthConfig[] = [
  {
    domain: getEnvOrThrow('VITE_AUTH_DOMAIN'),
    clientId: getEnvOrThrow('VITE_AUTH_CLIENT_ID'),
    apiDomain: getEnvOrThrow('VITE_API_DOMAIN'),
    thumbnailDomain: getEnvOrThrow('VITE_THUMBNAIL_DOMAIN'),
    authorizationParams: AUTHORIZATION_PARAMS,
  },
  {
    domain: getEnvOrThrow('VITE_AUTH_DOMAIN_US'),
    clientId: getEnvOrThrow('VITE_AUTH_CLIENT_ID_US'),
    apiDomain: getEnvOrThrow('VITE_API_DOMAIN_US'),
    thumbnailDomain: getEnvOrThrow('VITE_THUMBNAIL_DOMAIN_US'),
    authorizationParams: AUTHORIZATION_PARAMS,
  },
];
