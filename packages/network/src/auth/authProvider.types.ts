import { Context } from 'react';
import { Auth0ContextInterface, AuthorizationParams } from '@auth0/auth0-react';

/**
 * Configuration for a specific Auth0 authentication region.
 */
export interface AuthConfig {
  /**
   * The Auth0 domain for this region.
   */
  domain: string;
  /**
   * The Auth0 Client ID for this region.
   */
  clientId: string;
  /**
   * The API domain for this region.
   */
  apiDomain?: string;
  /**
   * The authorization parameters for this region.
   */
  authorizationParams: AuthorizationParams;
  /**
   * The Auth0 context to use for this region.
   */
  context?: Context<Auth0ContextInterface>;
}
