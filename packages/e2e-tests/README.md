# Overview
This project is aimed at providing end-to-end tests for the monkjs ecosystem using the Gherkin syntax.

# Running the tests
Before running the tests, install the NPM packages by running the following command :

```shell
yarn install
```

## Configuration
Whether you run the tests with the Cypress Runner or in the command line, you can define environment varibales to
configure how the tests are runned. The following environment variables are available :

| Variable Name              | Required | Description                                            | Accepted Values                      | Default Value             |
|----------------------------|----------|--------------------------------------------------------|--------------------------------------|---------------------------|
| `TEST_ENV`                 | ✔️       | Specifies which environment is being tested.           | `local`, `dev`, `staging`, `preview` | `dev`                     |
| `REACT_APP_AUTH0_DOMAIN`   | ✔️       | The Auth0 connection domain.                           | string                               | `idp.dev.monk.ai`         |
| `REACT_APP_AUTH0_AUDIENCE` | ✔️       | The Auth0 audience.                                    | string                               | `https://api.monk.ai/v1/` |
| `REACT_APP_AUTH0_SCOPE`    | ✔️       | The Auth0 scope needed for the connection.             | string                               | `openid profile email`    |
| `REACT_APP_AUTH0_CLIENTID` | ✔️       | The Auth0 application client ID.                       | string                               |                           |
| `AUTH0_CLIENT_SECRET`      | ✔️       | The Auth0 application client secret.                   | string                               |                           |
| `AUTH0_USERNAME`           | ✔️       | The username of the user used for the automated tests. | string                               |                           |
| `AUTH0_PASSWORD`           | ✔️       | The password of the user used for the automated tests. | string                               |                           |


## With the Cypress Runner
To open the Cypress Runner, simply run the following command :

```shell
yarn cy:open
```

You will then be able to select the features to test and see the runner executing the tasks on the browser in live.

## With the command line
To run the test in the command line, you can use the following yarn script :

```shell
yarn cy:run
```

This script is a shorthand for the `cypress run` command. You can see the available options for this command in
[the Cypress official doc](https://docs.cypress.io/guides/guides/command-line#cypress-run). For instance, to run a
specific feature file, you can use the following command :

```shell
yarn cy:run -- --spec "cypress/integration/MyFeature.feature"
```

# Contributing
## Creating a new feature
The feature files are located in the `cypress/integration` directory, and are named with the following syntax :
`MyFeature.feature`. The available step definitions are listed in [the step documentation](STEPS.md). For more info
on the Gherkin syntax and Cucumber in general, see [the references section](#references) below.

## Creating new steps
The global step definitions (steps used by multiple feature accross the whole project) are defined in the
`cypress/support/step_definitions` directory. In addition to that, each feature file (for example `MyFeature.ts`) can
be paired with a directory with the same name (in our example `MyFeature`) right next to it. In this directory should
be defined every step that is specific to this feature in particular. Please remember that
[according to the official Cucumber documentation](https://cucumber.io/docs/guides/anti-patterns/), feature-coupled are
considered antipattern and should be avoided if possible. For more info on Cypress and Cucumber patterns, see
[the references section](#references) below.

## Creating new commands
To create a new command, first declare it in the `Chainable` interface defined in `cypress/support/index.d.ts` :

```typescript
// cypress/support/index.d.ts
declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * My custom command.

     * @example cy.customCommand().then(() => console.log('Done!'));
     */
    customCommand(): Chainable<null>;
    /**
     * My other custom command.
     *
     * @param param My param.
     *
     * @example cy.otherCustomCommand(2).then((result: string) => console.log(result));
     */
    otherCustomCommand(param: number): Chainable<string>;
  }
}
```

Once your command has been declare, you can define and add it in `cypress/support/commands.ts` as such :

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('customCommand' as keyof Chainable, () => {});

Cypress.Commands.add('otherCustomCommand' as keyof Chainable, (param: number) => `${param}`);
```

# References
Before contributing to this project, it is recommended to first take a look at the following documentation references
if you are not already familiar with them :

- [Cypress Official Documentation](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test)
- [Cucumber Gherkin Reference](https://cucumber.io/docs/gherkin/)
- [Cucumber Official Documentation](https://cucumber.io/docs/cucumber/)
- [Cypress / Cucumber Preprocessor GitHub Docs](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/readme.md)

