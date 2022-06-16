import Chainable = Cypress.Chainable;
import { EnvVar } from '../../config';

export interface EnvSpecificFixture {
  webapp: string,
}

export function getCurrentEnvFixture(): Chainable<EnvSpecificFixture> {
  return cy.fixture<EnvSpecificFixture>(Cypress.env(EnvVar.TEST_ENV));
}
