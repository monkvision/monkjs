declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to log in with the Auth0 API using a username / password combination.
     *
     * @param username The username used to log in.
     * @param password The password used to log in.
     *
     * @example cy.loginByAuth0Api('user@monkvision.ai', 'superSecurePassword');
     * @example cy.loginByAuth0Api(Cypress.env(EnvVar.AUTH0_USERNAME), Cypress.env(EnvVar.AUTH0_PASSWORD));
     */
    loginByAuth0Api(username: string, password: string): Chainable<null>;
  }
}
