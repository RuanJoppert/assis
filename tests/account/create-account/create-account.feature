Feature: Create account

  Scenario: Create a new account
    Given a valid account number "123"
    When I create an account
    Then the account should be created

  Scenario: Create an account with an invalid account number
    Given an invalid account number "invalid"
    When I create an account
    Then the account should not be created

  Scenario: Account already exists
    Given an existing account number "123"
    When I create an account with the same account number
    Then the account should not be created