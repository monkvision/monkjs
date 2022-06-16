import jwt, { JwtPayload } from 'jsonwebtoken';
import { EnvVar } from '../../config';
import Chainable = Cypress.Chainable;
import Response = Cypress.Response;

export interface Auth0TokenExpiration {
  expiresIn: number;
  expiresAt: number;
  issuedAt: number;
}

export interface Auth0UserDetails {
  email: string;
  emailVerified: boolean;
  name: string;
  nickname: string;
  picture: string;
  updatedAt: string;
}

export interface Auth0Token {
  accessToken: string;
  idToken: string;
  tokenType: string;
  scope: string;
  clientId: string;
  issuer: string;
  subject: string;
  expiration: Auth0TokenExpiration;
  user: Auth0UserDetails;
  claims: JwtPayload;
}

export interface Auth0PostTokenRequest {
  grant_type: string,
  realm: string,
  audience: string,
  scope: string,
  client_id: string,
  client_secret: string,
  username: string,
  password: string,
}

export interface Auth0PostTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export const PASSWORD_REALM_GRANT_TYPE = 'http://auth0.com/oauth/grant-type/password-realm';
export const AUTH0_REALM = 'Username-Password-Authentication';

export function makeLoginRequest(username: string, password: string): Chainable<Response<Auth0PostTokenResponse>> {
  const url = `https://${Cypress.env(EnvVar.REACT_APP_AUTH0_DOMAIN)}/oauth/token`;
  const body: Auth0PostTokenRequest = {
    grant_type: PASSWORD_REALM_GRANT_TYPE,
    realm: AUTH0_REALM,
    audience: Cypress.env(EnvVar.REACT_APP_AUTH0_AUDIENCE) as string,
    scope: Cypress.env(EnvVar.REACT_APP_AUTH0_SCOPE) as string,
    client_id: Cypress.env(EnvVar.REACT_APP_AUTH0_CLIENTID) as string,
    client_secret: Cypress.env(EnvVar.AUTH0_CLIENT_SECRET) as string,
    username,
    password,
  };
  return cy.request<Auth0PostTokenResponse>({ method: 'POST', url, body });
}

export function decodeTokenFromAuth0Response(response: Auth0PostTokenResponse): Auth0Token {
  const claims = jwt.decode(response.id_token) as JwtPayload;
  return {
    accessToken: response.access_token,
    idToken: response.id_token,
    tokenType: response.token_type,
    scope: response.scope,
    clientId: claims.aud as string,
    issuer: claims.iss,
    subject: claims.sub,
    expiration: {
      expiresIn: response.expires_in,
      expiresAt: claims.exp,
      issuedAt: claims.iat,
    },
    user: {
      email: claims.email as string,
      emailVerified: claims.email_verified as boolean,
      name: claims.name as string,
      nickname: claims.nickname as string,
      picture: claims.picture as string,
      updatedAt: claims.updated_at as string,
    },
    claims,
  };
}
