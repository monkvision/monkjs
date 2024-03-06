# @monkvision/typescript-config
This package provides the TSConfigs used in MonkJs Typescript projects. It also exports useful type declarations for
compiling.

# Install
To install the project simply run the following command :

```shell
yarn add -D typescript @monkvision/typescript-config
```

# How to use
To use one of the Typescript config exported by this package, place the following code in your `tsconfig.json` :

```json
{
  "extends": "@monkvision/typescript-config/tsconfig.json",
  "include": ["src", "test"]
}
```

You can replace `tsconfig.json` by the name of the config file you want to use.

We also recommend using a second tsconfig file used for building your sources using the command
`tsc -p tsconfig.build.json`. The build file will specify the outDir and exclude the test files like this :

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "exclude": ["test"]
}
```

# Available configs
Here is a list of available Typescript config files exported by this project :

| Name                         | Usage                                        |
|------------------------------|----------------------------------------------|
| `tsconfig.json`              | Base configuration for TypeScript projects   |
| `tsconfig.react.json`        | Base configuration for React projects        |
| `tsconfig.react-native.json` | Base configuration for React Native projects |
