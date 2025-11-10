import { Context } from 'react';
import { Auth0ContextInterface, AuthorizationParams } from '@auth0/auth0-react';

/**
 * Auth0 authentication configuration.
 */
export interface AuthConfig {
  /**
   * Auth0 domain (e.g., "idp.monk.ai").
   */
  domain: string;
  /**
   * Auth0 client ID.
   */
  clientId: string;
  /**
   * Authorization parameters for Auth0.
   */
  authorizationParams: AuthorizationParams;
  /**
   * Base domain for API requests.
   */
  apiDomain?: string;
  /**
   * Domain for thumbnail images (image_resize microservice).
   */
  thumbnailDomain?: string;
  /**
   * Custom Auth0 context (optional).
   */
  context?: Context<Auth0ContextInterface>;
}
