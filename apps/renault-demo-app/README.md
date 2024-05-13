# Renault Demo App
This application is a custom demo app made to showcase some features to Renault.

# Running the App
In order to run the app, you will need to have [NodeJs](https://nodejs.org/en) >= 16 and
[Yarn 3](https://yarnpkg.com/getting-started/install) installed. Then, you'll need to install the required dependencies
using the following command :

```bash
yarn install
```

You then need to copy the local environment configuration available in the `env.txt` file at the root of the directory
into an env file called `.env` :

```bash
cp env.txt .env
```

You can then start the app by running :

```bash
yarn start
```

The application is by default available at `https://localhost:17200/`.

# Building the App
To build the app, you simply need to run the following command :

```bash
yarn build
```

Don't forget to update the environment variables defined in your `.env` file for the target website.

# Tests
Since this is just a test and demo app, we did not spend time writing unit tests in this app.
