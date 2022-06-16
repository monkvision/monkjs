import { Auth0PostTokenResponse, decodeTokenFromAuth0Response, makeLoginRequest } from './auth0';
import Chainable = Cypress.Chainable;
import Response = Cypress.Response;

Cypress.Commands.add('loginByAuth0Api' as keyof Chainable, (username: string, password: string) => {
  cy.log(`Logging in as ${username}`);

  makeLoginRequest(username, password).then(({ body }: Response<Auth0PostTokenResponse>) => {
    const token = decodeTokenFromAuth0Response(body);
    cy.log(`Login successful. Auth0 token : ${token.accessToken}`);

    const dataToStore = JSON.stringify({
      accessToken: token.accessToken,
      tokenType: token.tokenType,
      expiresIn: token.expiration.expiresIn,
      scope: token.scope,
      issuedAt: token.expiration.issuedAt,
    });

    return window.localStorage.setItem('@auth_Storage', dataToStore);
  });
});
