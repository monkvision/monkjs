import { defineParameterType, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { getCurrentEnvFixture } from '../../fixtures';

const MOBILE_VIEWPORT_HEIGHT = 851;
const MOBILE_VIEWPORT_WIDTH = 450;

defineParameterType({
  regexp: /webapp/,
  transformer: (s) => s,
  name: 'appName',
});

defineParameterType({
  regexp: /portrait|landscape/,
  transformer: (s) => s,
  name: 'viewportMode',
});

function setViewportDimmensions(viewportWidth: number, viewportHeight: number): void {
  Cypress.config({ viewportWidth, viewportHeight });
  cy.viewport(viewportWidth, viewportHeight);
}

Given('That I am on the {appName} home page', (appName: string) => {
  getCurrentEnvFixture().then((fixture) => {
    Cypress.config({ baseUrl: fixture[appName] as string });
    return cy.visit({ url: '/' });
  });
});

Given('That I am on mobile in {viewportMode} mode', (viewportMode: string) => {
  const viewportWidth = viewportMode === 'portrait' ? MOBILE_VIEWPORT_WIDTH : MOBILE_VIEWPORT_HEIGHT;
  const viewportHeight = viewportMode === 'portrait' ? MOBILE_VIEWPORT_HEIGHT : MOBILE_VIEWPORT_WIDTH;
  setViewportDimmensions(viewportWidth, viewportHeight);
});

When('I rotate my device', () => {
  const { viewportWidth, viewportHeight } = Cypress.config();
  setViewportDimmensions(viewportHeight, viewportWidth);
});

Then('I should be in the home page', () => {
  const { baseUrl } = Cypress.config();
  cy.url().should('eq', `${baseUrl}/`);
});
