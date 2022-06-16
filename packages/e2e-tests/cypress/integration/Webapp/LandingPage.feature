@webapp @landingPage
Feature: Webapp landing page
  The webapp's landing page.

  Background:
    Given That I am on the webapp home page

  @authentication @localStorage
  Scenario: Arriving on the landing page with my authentication token already stored
    Given That I am already connected
    Then I should see an element containing "Sign out"

  @authentication @localStorage
  Scenario: Disconnecting from the webapp
    Given That I am already connected
    When I click on the element containing "Sign out"
    Then I should not see an element containing "Sign out"
    And I should not have an authentication token stored in my browser
