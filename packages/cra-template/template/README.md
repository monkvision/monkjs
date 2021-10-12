![Monk banner](public/img/banner.webp)

``` text
author: monkvision
name: monk-new-react-project
description: Freshly initiated React project.
version: 1.0.0
```

## Requirements

1. Install your favorite IDE ([Webstorm](https://www.jetbrains.com/fr-fr/webstorm/) of course :-P)
2. Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
3. Install [nodejs](https://nodejs.org/en/download/) and [yarn](https://classic.yarnpkg.com/en/docs/install)
4. Install [expo](https://docs.expo.dev) globally

## Bulk CLI

``` bash
sudo -s -- 'git --version; port install yarn; npm install --global expo-cli'
```

``` bash
sudo -s -- 'apt update; apt install git; apt install nodejs && npm install --global yarn; npm install --global expo-cli'
```

## Installation

- Accept invitation to the [GitHub Monk organization](https://github.com/monkvision)
- Configure [git for GitHub](https://git-scm.com/book/en/v2/GitHub-Account-Setup-and-Configuration) or your IDE to get VCS authentication
- Use of [personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) recommended
- Go in your projects directory and clone the repository

``` bash
cd ~/WebstormProjects

# clone with https (fastest)
git clone https://github.com/monkvision/monkjs.git

# clone with ssh (safest)
# make sure to have linked your public key to GitHub
git clone git@github.com:monkvision/monkjs.git

# clone with ssh and GitHub CLI (safest and cleanest)
gh repo clone monkvision/monkjs
```

[Useful Commands](https://www.notion.so/Useful-Commands-84a07afcdc7f45d2bb68f6ff5a16ca43) Create a personal SSH ID

- Go in the project folder and install dependencies

``` bash
cd monk && yarn install
```

- Customize your project environment with settings and keys

``` bash
cp .env .env.local
```

## Files structure example

```
┌── components                      # uncontrolled-ish components with no-depth
    ├── ...
    └── MyComponent
        ├── index.jsx
        ├── index.fallback.jsx      # is displayed when the component crashes
        ├── MyComponent.md          # documentation for the Component
        └── MyComponent.test.js
├── hooks                       # react hooks for recurent cases
├── store                     # reducers and combinedReducers
    ├── slices
    └── index.js
├── functions                       # helper functions or classes
├── views                           # controlled components with *-depth
    ├── ...
    └──  App
        ├── ...
        └── index.jsx
├── ...
├── .env
├── .env.local
├── index.jsx
└── README.md
```

## Versioning

**[Based on our versioning rules.](https://www.notion.so/Versioning-2dc3113c8e6340f6bd45bdd97f303602)**

- Branch `main` is the more advanced development version and is protected
- Branch `live` is for production and is protected
- Trust our assistant `Futura` via [workflows and actions](https://docs.github.com/en/actions)
- Rebase only if necessary otherwise keep the history of your work
- [Commit IDE configuration](https://stackoverflow.com/questions/116121/should-i-keep-my-project-files-under-version-control/119377#119377) for others to onboard

## What should be tested?

It's more important to decide what should be tested rather to decide with what.

- Components uncontrolled components
- Pure JS functions
- Classes especially those being proxies between front and back
- Views rendering combine with snapshot at each state of the view

## Production links

- **Documentation** [monkvision.github.io/monk](https://monkvision.github.io/monk)
- **Super Monk** [super.monkvision.ai](https://super.monkvision.ai/)
- **Monk Console** [console.monkvision.ai](https://super.monkvision.ai/)
- **Monk Android PlayStore** [play.google.com/store/apps/monk](https://play.google.com/store/apps/details?id=com.monk&gl=FR)
- **Monk iOS App Store**

---

[Engineering philosophy](https://www.notion.so/Engineering-philosophy-0e7adc34dd27446b979f897b87c38703)
