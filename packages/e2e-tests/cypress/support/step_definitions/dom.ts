import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When('I click on the element containing {string}', (content: string) => {
  cy.contains(content).click();
});

When('I click on the menu item with the index {int}', (index: number) => {
  cy.get('[role="menuitem"]').eq(index).click();
});

When('I enter {string} in the prompt', (prompt: string) => {
  cy.window().then((win) => cy.stub(win, 'prompt').returns(prompt));
});

When('I cancel the prompt', () => {
  cy.window().then((win) => cy.stub(win, 'prompt').callsFake(() => null));
});

Then('I should see an element containing {string}', (message: string) => {
  cy.contains(message);
});

Then('I should not see an element containing {string}', (message: string) => {
  cy.contains(message).should('not.exist');
});
