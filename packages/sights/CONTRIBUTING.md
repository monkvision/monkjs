# Contributing to @monkvision/sights
This documentation is for developers who are contributing to this package. If you are planning on installing and using
this package, please refer to [this page](README.md).

# Introduction
This package is a unique package in the Monk SDK and serves multiple purposes :

- Store the Monk research data for the Sights (see *Sights Research Database* section below)
- Validate and lint the Monk research data to avoid regressions and guarantee uniform data structures
- Export some parts of the Monk research data into the SDK
- Provide JavaScript code to import the Monk research data more easily
- Provide TypeScript type definitions for users that are importing the data into TypeScript codebases

To get more details about the way the research data is stored in the *Sights Research Database* section below. In order
to fulfill all the purposes mentionned in the list above, this package exposes 5 main NPM scripts :

- `clean` : Removes the compiled and built files.
- `compile` : Compile the TypeScript scripts that will be executed to build the project.
- `build` : Validate the research data and build the exported data and files that will be published in NPM.
- `test` : Validate the research data and unit test the build scripts. (use `test:coverage` to collect coverage
  reports).
- `lint` : Check for linting errors in the project files and research data (use `lint:fix` to fix the errors that can be
  automatically fixed).

To get a detailed explanation of what are the building steps, please take a look at the *Building Workflow* section
below. For more details about the research data validation, please refer to the *Sights Research Database* section
below.

# Get Started
## Installing
To install the project dependencies, simply run `yarn` at the root of the project.

## Building
To build the project, run the following command : `yarn build`. The building steps are described in details in
the *Workflow* section below.

## Testing
To run the tests, use the following command : `yarn test`. To collect coverage data, use the following command instead :
`yarn test:coverage`. The coverage report will be generated in the `coverage` directory.

# Building Workflow
Here are the different steps in the building workflow and what do they do :

- Clean the already existing files using the `clean` script.
- Compile the build and validation TypeScript scripts (located in the `src` directory) into an output directory named
  `dist`. This directory is **NOT** published to NPM and is only containing built scripts used for *building* the
  project.
- Execute the build and validation scripts :
  - Validate the research data (see the *Sights Research Database* section below for more details).
  - Generate the research data that will be exposed and published in the SDK. This step consists of filtering out the
    research data to keep only the data we need to expose in the SDK. The resulting output of this step consists of
    many JSON files that will be generated in the `src/lib` directory, to be used for the next steps. Note that these
    files are ignored by git.
  - Generate the TypeScript code that will export the data in the JSON files in a more user-friendly way. These
    generated TypeScript files also add type definitions (casting) to the raw JSON data. In this step, file templates
    located in the `src/templates` are used to generate the TypeScript files in the `src/lib` directory, to be used for
    the next steps. Note that these files are ignored by git.
- Use the TypeScript compiler to build the final JavaScript files and the type declarations. In this step, we use the
  `tsconfig.build.json` file to build every TypeScript file located in the `src/lib` directory (along with the JSON data
  files). The output of this step are JavaScript and TypeScript Declaration files generated in the `lib` directory. This
  directory is what is published to NPM. Note that these files are ignored by git.

# Sights Research Database
## Single Source of Truth
In addition to exposing sights data to SDK users, this package also acts as research database for sights, and is
considered the single source of truth when discussing sights info. The research data for sights is stored in the
`research` directory and contains a lot more data than what is exposed in the SDK. When compiling and building the
project, the research data is filtered out, and only the info we decide to expose in our SDK are kept in the output.

## Data Structure
The research database consists of JSON files stored in the `research/data` directory and its subdirectories. It contains
the following files :

- `labels.json` : A list of sight label translations. It maps a translation key to clear translations in
  English, French, German and in Dutch.
- `vehicles.json` : A list of vehicle models for the sights. It maps a vehicle type key to the vehicle details.
- A directory per vehicle type key that contains :
  - A JSON file containing the sight details for this vehicle type.
  - An `overlays` directory that contains the SVG files of the sight overlays for this vehicle type.
- A directory named `all` that is similar to the other vehicle type directories described above and that contains the
  sights that are usable for every vehicle type.

## Data Validation
The research data is strictly validated during the building and testing phases. In addition to some other validation
steps that are described below, JSON schemas are used to validate the JSON research files. The schemas used for
validation are stored in the `research/schemas` directory and its subdirectories. Here is the list of JSON schemas used
for validation in the project :

- `labels.schema.json` : JSON schema for the `labels.json` file mentionned above.
- `vehicles.schema.json` : JSON schema for the `vehicles.json` file mentionned above.
- `sight.schema.json` : JSON schema describing a sight in any JSON file containing a list of sights. Note that this
  Sight definition does NOT include the `id` and `mirror_sight` property definitions because of reasons mentioned below.
- A directory named `subschemas` that contains JSON schema definitions used in the main JSON schema files.

In addition to these schemas, there should be, next to each vehicle sights file in the `research/data` subdirectories, a
schema that validates this exact file (using the Sight definition in `sight.schema.json`). The validation is done this
way in order to enforce stricter rules for the vehicle sights files (adding regexp pattern enforcing in property keys,
and in the `id` and `mirror_sight` properties).

In addition to the data validation using JSON schemas, this project also implements extra validations rules :

- Every vehicle type should have its own sights index file.
- No file should be present in the vehicle type directy except for the sights index file and its schema.
- Every mirror sight declared should have a matching counterpart in the mirror sight.
- Every sight should have an overlay file.
- No unused overlays.
- Every overlay file should be minified (only one line long).

## Nota Bene
Before editing the research data, please take note of the following information :

- The `dimensions_xyz` property should technically be required in the `vehicles.json`, but since we do not currently
  have this info for the `audia7` and `vwtroc` vehicles, we are leaving it as optional for now. Note that for future
  vehicles, this property is **REQUIRED**. This note also serves as a reminder that we should add this missing info in
  our database at some point.
