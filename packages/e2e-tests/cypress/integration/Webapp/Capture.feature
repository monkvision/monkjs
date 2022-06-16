@webapp @capture
Feature: Webapp capture feature
  The webapp's implementation of the Monk Capture SDK.

  Background:
    Given That I am on the webapp home page
    And That I am already connected

  @mobile
  Scenario: Trying to use the capture feature using a mobile viewport in portrait mode
    Given That I am on mobile in portrait mode
    When I start a Damage detection inspection
    Then I should see an element containing "Please rotate your device"

  @mobile
  Scenario: Rotating the mobile device to landscape mode to see the capture component
    Given That I am on mobile in portrait mode
    When I start a Damage detection inspection
    And I rotate my device
    Then I should see an element containing "Take picture"

  @disabled
  Scenario: Canceling an inspection
    When I start a Wheels analysis inspection
    And I click on the element containing "Quit"
    Then I should be in the home page
