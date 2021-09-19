import Constants from 'expo-constants';

// eslint-disable-next-line import/prefer-default-export
export const auth0Discovery = {
  authorizationEndpoint: `https://${Constants.manifest.extra.AUTH_DOMAIN}/authorize`,
  tokenEndpoint: `https://${Constants.manifest.extra.AUTH_DOMAIN}/oauth/token`,
  revocationEndpoint: `https://${Constants.manifest.extra.AUTH_DOMAIN}/oauth/revoke`,
  useInfoEndpoint: `https://${Constants.manifest.extra.AUTH_DOMAIN}/userinfo`,
  endSessionEndpoint: `https://${Constants.manifest.extra.AUTH_DOMAIN}/v2/logout`,
  registrationEndpoint: `https://${Constants.manifest.extra.AUTH_DOMAIN}/dbconnections/signup`,
};
