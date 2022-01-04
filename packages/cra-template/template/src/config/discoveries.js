import { authConfig } from 'config/corejs';

export default {
  authorizationEndpoint: `https://${authConfig.domain}/authorize`,
  tokenEndpoint: `https://${authConfig.domain}/oauth/token`,
  revocationEndpoint: `https://${authConfig.domain}/oauth/revoke`,
  useInfoEndpoint: `https://${authConfig.domain}/userinfo`,
  endSessionEndpoint: `https://${authConfig.domain}/v2/logout`,
  registrationEndpoint: `https://${authConfig.domain}/dbconnections/signup`,
};
