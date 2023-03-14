# 👁️‍🗨️ @monkvision/scripts

To get all the Monitoring metrics

``` yarn
yarn run extract-metrics
```

We need a environment (.env) file at the same directory with below keys

## TOKEN
`PropTypes.string`

Sentry auth_token to access the api's

## PROJECTS
`PropTypes.arrayOf(PropTypes.string)`

List of all projects if user wants to filter else pass empty value (Ex. "")

## ENVIRONMENT
`PropTypes.string`

Environment for which user wants to filter else pass empty value (Ex. "")
