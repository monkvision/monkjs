---
id: intro
title: "🚀 Getting started"
slug: /
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/camera/latest.svg)

**Get a fully automated damage report classified by type, car parts, position and severity.**

## Modules overview

```yarn
yarn add @monkvision/corejs @monkvision/camera @monkvision/sights @monkvision/visualization @monkvision/toolkit @monkvision/ui
```
_Bulk CLI adding all of our packages._

### [@monkvision/corejs](https://monkvision.github.io/monkjs/docs/js/api/inspections)
Pure JS API implementing schema's and reducers ready to be imported in your app.
Uses [Axios](https://axios-http.com/docs/res_schema)
, [Redux](https://redux-toolkit.js.org/api/createEntityAdapter#selector-functions)
& [Normalizr](https://github.com/paularmstrong/normalizr/blob/master/docs/api.md#denormalizeinput-schema-entities)
for an optimized and state control.
Can also be used only to make requests directing our
[Monk core API](https://api.monk.ai/v1/apidocs/).

![@monkvision/corejs](https://github.com/monkvision/monkjs/actions/workflows/corejs-analyze.yml/badge.svg)

### [@monkvision/sights](https://monkvision.github.io/monkjs/sights)
Pure JSON collection of Sights & Overlays. A sight is an Object of data defining a Taking Picture point of view. An overlay is the graphic SVG represantion of a sight.

![@monkvision/sights](https://github.com/monkvision/monkjs/actions/workflows/sights-analyze.yml/badge.svg)

### [@monkvision/camera](https://monkvision.github.io/monkjs/docs/js/api/components/capture)
This is the spine of our front-end components.
It allows taking high quality picture in Native & Web platforms.
It also checks about compliance (blur, exposure, angle, visible car parts...)
and guides users to snap their best pictures of the vehicle.

![@monkvision/camera](https://github.com/monkvision/monkjs/actions/workflows/camera-analyze.yml/badge.svg)

### [@monkvision/visualization](https://monkvision.github.io/monkjs/docs/js/api/components/damage-highlight)
This is the voice explaining all the data we get.
Built with React and React Native,
it shows with smart components where are the damages,
on a simple list or in a 2D vehicle representation.

Designed by our best UI/UX people, our visualization components are tailored for you and fully customizable.

> For example: having damages on a red car ? Boxing damages in green because green is better seen on red.

![@monkvision/visualization](https://github.com/monkvision/monkjs/actions/workflows/visualization-analyze.yml/badge.svg)

## 🪲 Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Auth0 Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

For Monk related questions/support please use the [Support Center](https://support.monkvision.ai).

## ⚖️ License

This project is licensed under the Clear BSD license. See the [LICENSE](/monkjs/license) file for more info.


## What's next?

You can start following our [guides](https://monkvision.github.io/monkjs/docs/js/guides/setting-up) on first, setting up depending on the workflow you use, then taking pictures.

> Are you starting a new application? We recommend the use of Expo.
> Already have a React Native app? Some implementation may be required
> to manage iOS, Android and Web compatibility as much as possible.
