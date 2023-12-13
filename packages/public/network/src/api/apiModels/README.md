## @monkvision/network - API Types

This directory contains TypeScript type definitions that specify the objects used when communicating with the Monk
Back-End API (request payload, response body etc.). All types declared in this directory are taken word for word from
[the official API Swagger Doc](https://api.preview.monk.ai/v1/apidocs) (the preview env was used when generating these
types). In order to ensure that these type do not collide with any other business type declared in the SDK, their name
is always suffixed with `Api`.

When adding or modifying types in this directory, please note the following :

- The types declared must always be equal to the types declared in the Swagger (no extra field or mismatched property
  type).
- We try to only specify types and properties needed. This means that if your don't need a property or a type, don't
  declare it. This will help us limit errors and bugs between us and the Back-End.

## Known Issues

As of the day I'm writing this documentation _(Samy - 12/12/2023)_, there are several known issues with the Swagger
documentation :

- Wrong return types : A bug known by the back-end team that causes the API to send responses that are different from
  the ones specified in the Swagger. For this reason, the types declared in this directory right now could actually
  differ a bit from the official Swagger (as we are describing types for the REAL response from the server). But this
  issue should hopefully be fixed at the start of the next quarter _(end of Jan. 2024)_. Once the issue is fixed, we
  will need to go over the previously defined types one by one and make sure that they all match the fixed Swagger docs.
- Duplicate names : The names of the types declared in the Swagger docs are supposed to be uniques but sometimes that is
  not case. For duplicate names, we either remove the duplicates if we can, or we exceptionnaly rename it in the
  Front-End docs.
