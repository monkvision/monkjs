@webapp @VIN @inspection
Feature: Webapp VIN recognition feature
  The webapp's VIN recognition feature that allows the user to either enter manually or automatically detect the VIN
  number of his vehicle.

  Background:
    Given That I am on the webapp home page
    And That I am already connected

  @manualInspection
  Scenario: Manually entering the VIN number
    When I start a VIN recognition inspection
    And I click on the menu item with the index 1
    And I enter "123456789" in the prompt
    Then I should be in the home page
    And I should see an element containing "123456789"

  @manualInspection
  Scenario: Manually entering the VIN number and canceling before completing the prompt
    When I start a VIN recognition inspection
    And I click on the menu item with the index 1
    And I cancel the prompt
    And I click on the element containing "Go back"
    Then I should be in the home page
