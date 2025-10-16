Feature: Test Launches page
    Background:
        Given I visit Report Portal
        And I log in
        And I go to Launches page

    Scenario: Check user is able to select several launches and compare them
        When User selects several launches
        And Compare selected launches
        Then Launches comparison graph is visible

    Scenario: Check user is able to remove launch
        When User select a launch
        And Removes selected launch
        Then Selected launch is removed from the list

    Scenario Outline: Check user is able to move to <launchViewPage> view clicking on <launchGridElement>
        When User clicks on the "<launchGridElement>"
        Then User is navigated to "<launchViewPage>"

        Examples:
            | launchGridElement | launchViewPage |
            | launch name       | all launches   |
            | total             | total tests    |
            | passed            | passed tests   |