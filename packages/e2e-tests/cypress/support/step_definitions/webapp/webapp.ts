import { defineParameterType, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { EnvVar } from '../../../../config';

defineParameterType({
  regexp: /VIN recognition|Damage detection|Wheels analysis/,
  transformer: (s) => (s === 'VIN recognition' ? 'Vehicle identification number' : s),
  name: 'inspectionType',
});

Given('That I am already connected', () => {
  cy.loginByAuth0Api(Cypress.env(EnvVar.AUTH0_USERNAME), Cypress.env(EnvVar.AUTH0_PASSWORD));
});

When('I start a {inspectionType} inspection', (inspectionType: string) => {
  cy.contains(inspectionType).click();
});

Then('I should not have an authentication token stored in my browser', () => {
  expect(window.localStorage.getItem('@auth_Storage')).to.be.null;
});
