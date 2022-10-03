# Sights Util Tools
This directory contains useful Node.Js scripts to help debug and fix invalid sights. To run the scripts, you will need
to have installed [Node.Js](https://nodejs.org/en/) as well as a node package manager such as
[yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/).

# Installation
The `fix-sights.js` package require the installation of `svgo`, [an NPM package](https://github.com/svg/svgo) used to
clean SVG files. To install the required dependencies, simply run the following command :

```shell
yarn
```

or

```shell
npm i
```

# Checking Sights
The `check-sights.js` script is used to check the validity of the sight currently defined in the package. To run the
script, simply run the following command :

```shell
node check-sights.js
```

This script will check for the following errors in the sight package :

- Sights with an invalid or no label at all in the `index.json`.
- Sights defined in the `index.json` with no corresponding overlay.
- Sights defined in the `index.json` with a corresponding overlay that is not minified.
- Files lcoated in the overlay directory that do not have an SVG extension.
- Overlays located in the overlay directory that do not have any corresponding sight in the `index.json`.

If some errors are found, an error log file named `errors.json` will be generated next to the script containing details
about the sight IDs etc.

# Fixing Sights
The `fix-sights.js` script is used to fix errors detected by the `check-sights.js` script. To use it, you first need to
run the `check-sights.js` script and generate the error log. Then, you can run the `fix-sights.js` to automatically fix
some errors. Note that to use this script, you first need to install the required dependencies using `yarn` or `npm i`.

To run the script, use the following command :

```shell
node fix-sights.js [all]
```

| Arg Name | Accepted Values | Required | Description                                       |
|----------|-----------------|----------|---------------------------------------------------|
| `all`    | `all`           |          | Use this option to also delete obsolete overlays. |

Here are the fix that this script automatically makes :

- If some sights have a String label (instead of an object containing French and English translations), it will look for
  sights in the `index.json` with the same label, but with both translations, and will fix the first sight's label
  accordingly.
- If some sights have missing overlays, but specify their mirror sight, and if this mirror sight has an overlay, then
  the script will automatically mirror the overlay, minify it, and rename it to add the missing overlay.
- If some sights have missing overlays because their overlay ends with the `.white.svg` extension (the extension given)
  to us in the ZIP directories every time, the overlay will be renamed (and minified).
- If some overlays are not minified, the script will automatically minify them using `svgo`.
- If the `all` option is used, the script will remove every file in the SVG overlay directory that do not have an SVG
  file extension.
- If the `all` option is used, the script will remove every overlay located in the overlay directory that do not have
  a corresponding sight in the `index.json`.

Here are _some_ errors that this script can not automatically fix :

- Missing labels or String labels that do not have any known translation.
- Missing overlays for sights that do not specify a mirror counterpart (or if its mirror counterpart is also missing its
  overlay), or that do not exist at all.
- ...

# Mirror SVGs
This `svg-mirror.js` script allows you to mirror a large number of SVG files either horizontally, vertically, or both.

To use this script, simply place every svg file you want to mirror inside one or many directories. Then
use the following command :

```shell
node svg-mirror.js [direction] [directories ...]
```

| Name          | Accepted Values                    | Required | Description                                          |
|---------------|------------------------------------|----------|------------------------------------------------------|
| `direction`   | `horizontal`, `vertical` or `both` | ✔        | The direction of the mirror transformation to apply. |
| `directories` | `string`                           | ✔        | The path(s) to the input dir(s).                     |

Examples :

```shell
node svg-mirror.js horizontal ./inputDir
```

```shell
node svg-mirror.js both ./inputDir1 ../../inputDir2
```
