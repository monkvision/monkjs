# @monkvision/sights
This documentation is for developers who are installing and using this package. If you are a developer contributing to
this package, please refer to [this page](CONTRIBUTING.md).

This package exposes the Monkvision sights info. The exported data contains sights label translations, vehicle type
info, sight overlays (SVG) as well as miscellaneous sight details. This package is required if you are planning on using
the standard Monkvision Capture workflow, of simply if you ar planning on using sights at all. The complete list of
available sights in the SDK can be obtained in the official Monkvision documentation.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/sights
```

If you are using TypeScript, this package comes with its type definitions integrated, so you don't need to install
anything else!

# Usage
## Sights
Once the package is installed, every sight available in this package can be obtained using its ID in the following way :

```typescript
import { sights } from '@monkvision/sights';

console.log(sights['haccord-8YjMcu0D']);
```

## Sight Labels
Each sight has a custom label, available in all languages supported by the Monk SDK. The labels can be obtained in the
following way :

```typescript
import { sights, labels } from '@monkvision/sights';

const sight = sights['haccord-8YjMcu0D'];
console.log(labels[sight.label].fr);
```

## Vehicle Details
Each sight is associated with a specific vehicle. The details for each vehicle can be obtained in the following way :

```typescript
import { sights, vehicles } from '@monkvision/sights';

const sight = sights['haccord-8YjMcu0D'];
console.log(vehicles[sight.vehicle]);
```

## Looking up sight IDs by label (and vice versa)
When you already know a sight's human-readable name (e.g. `"Front low"`) but need its ID for a given vehicle model,
or you have a list of sight IDs and want their readable names back, use the lookup helpers :

```typescript
import { VehicleModel } from '@monkvision/types';
import { resolveSightIdsFromNames, resolveNamesFromSightIds } from '@monkvision/sights';

resolveSightIdsFromNames(['Front low', 'Hood'], VehicleModel.HACCORD);
// [
//   { input: 'Front low', labelKey: 'front-low', sightIds: ['haccord-8YjMcu0D'], ambiguous: false },
//   { input: 'Hood', labelKey: 'hood', sightIds: ['haccord-DUPnw5jj'], ambiguous: false },
// ]

resolveNamesFromSightIds(['haccord-8YjMcu0D', 'haccord-DUPnw5jj']);
// [
//   { sightId: 'haccord-8YjMcu0D', labelKey: 'front-low', englishLabel: 'Front Low' },
//   { sightId: 'haccord-DUPnw5jj', labelKey: 'hood', englishLabel: 'Hood' },
// ]
```

Names are normalized (lower-cased, trimmed, spaces replaced with hyphens) before being matched against label
dictionary keys. Unmatched names, labels with no sight for the requested vehicle model, and ambiguous labels
(more than one sight sharing the same label for that vehicle) are reported in the result instead of being guessed —
see the `error`/`ambiguous` fields.

# Contributing
Please refer to [this page](CONTRIBUTING.md) for more documentation if you are a developer contributing to this project.
