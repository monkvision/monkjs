---
sidebar_position: 10
---

# sights
![npm latest package](https://img.shields.io/npm/v/@monkvision/sights/latest.svg)

## Overview
A "Sight" in the MonkJs SDK corresponds to a point of view at which the user can take a photo of its vehicle during an
inspection. Sights are crucial in the proper functionning of the SDK, because taking good pictures of the vehicle will
result in better results from the damage detection AI. This is why our R&D has spent a lot of time carefully designing
the Sights used in the SDK to maximize the performances of our AI models.

This package exposes the Monkvision sights info. The exported data contains sights label translations, vehicle type
info, sight overlays (SVG) as well as miscellaneous sight details. This package is required if you are planning on using
the standard Monkvision Capture workflow, of simply if you ar planning on using sights at all.

## Complete Documentation
As every other package in the SDK, please refer to
[its README file](https://github.com/monkvision/monkjs/blob/main/packages/sights/README.md) for a complete
documentation on how this package works.
