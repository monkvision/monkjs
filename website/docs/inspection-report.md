---
id: inspection-report
title: "🧿 Inspection Report"
slug: /inspection-report
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/inspection-report/latest.svg)

# Package Overview

The Inspection Report package allows users to visualize and edit the results of an inspection before generating the
final PDF report. This includes things such as visualizing the location, severity, and/or repair cost of damages on the
car, as well as adding, editing, or removing damages in the report.

# Implementation Guide
## Installation

To install the package simply run the following command in your project :

```bash
yarn add @monkvision/inspection-report
```

## Basic Usage
The `DamageReport` component exported by the package is a single page component that will automatically display the
different pages of the damage report, and let the user visualize and edit it. All you need is the ID of the inspection.
The only way for the user to leave this component is if he presses the "Start New Inspection" button, in which case a
callback will be called, allowing you to navigate to another page.

Here is a minimal working example :

```javascript
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { DamageReport } from '@monkvision/inspection-report';
import { PAGES } from '../navigation';

export default function InspectionReport({ inspectionId }) {
  const navigation = useNavigation();

  return (
    <DamageReport
      inspectionId={inspectionId}
      onStartNewInspection={() => navigation.navigate(PAGES.HOME)}
    />
  );
}
```

# API
## Components
### DamageReport
#### Description
```javascript
import { DamageReport } from '@monkvision/inspection-report';
```

This component is a single page component that implements the visualizing and editing of the damage report.

#### Props
| Prop                      | Type              | Description                                                                                                                                                            | Required | Default Value |
|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| `element`                 | `HTMLElement`     | The HTML SVG element to display                                                                                                                                        | ✔        |               |
| `onPressPart`             | `function`        | Callback function called when a car part is pressed. The only argument is the part name                                                                                |          | `() => {}`    |
| `onPressPill`             | `function`        | Callback function called when a damage pill is pressed. The only argument is the associated part name                                                                  |          | `() => {}`    |
| `getPartAttributes`       | `function`        | Custom function used to apply custom HTML attributes to specific car parts. It should take part name as argument and return an object representing the HTML attributes |          | `() => {}`    |
| `damages`                 | `object[]`        | The list of damages on the car. Each damage on this list will have a pill displayed on the wireframe                                                                   |          | `[]`          |
| `damages.part`            | `string`          | The part associated with the damage                                                                                                                                    | ✔        |               |
| `damages.id`              | `string`          | The ID of the damage                                                                                                                                                   |          |               |
| `damages.pricing`         | `number`          | The cost of repair of the damage                                                                                                                                       |          |               |
| `damages.severity`        | `Severity`        | The severity of the damage                                                                                                                                             |          |               |
| `damages.repairOperation` | `RepairOperation` | The type of operation needed to repair the damage                                                                                                                      |          |               |

### CarView360 component
#### Description
```javascript
import { CarView360 } from '@monkvision/inspection-report';
```

> ⚠️ This component only works on Web ⚠️

This component displays a wireframe view of a car allowing you to display damages and make the wireframes interactives.

#### Example of Usage
```javascript
import { CarView360, useCarOrientation } from '@monkvision/inspection-report';

export default function MyCustomCarView({ damages, width }) {
  const {
    orientation,
    rotateLeft,
    rotateRight,
    setOrientation,
  } = useCarOrientation();

  return (
    <CarView360
      damages={damages}
      orientation={orientation}
      width={width}
    />
  );
}
```

#### Props
| Prop                      | Type              | Description                                                                                                                                                            | Required | Default Value |
|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| `orientation`             | `CarOrientation`  | The orientation of the wireframe                                                                                                                                       | ✔        |               |
| `vehicleType`             | `VehicleType`     | The type of vehicle to display                                                                                                                                         | ✔        |               |
| `width`                   | `number`          | The width of the wireframes                                                                                                                                            |          | `undefined`   |
| `height`                  | `number`          | The height of the wireframes                                                                                                                                           |          | `undefined`   |
| `onPressPart`             | `function`        | Callback function called when a car part is pressed. The only argument is the part name                                                                                |          | `() => {}`    |
| `onPressPill`             | `function`        | Callback function called when a damage pill is pressed. The only argument is the associated part name                                                                  |          | `() => {}`    |
| `getPartAttributes`       | `function`        | Custom function used to apply custom HTML attributes to specific car parts. It should take part name as argument and return an object representing the HTML attributes |          | `() => {}`    |
| `damages`                 | `object[]`        | The list of damages on the car. Each damage on this list will have a pill displayed on the wireframe                                                                   |          | `[]`          |
| `damages.part`            | `string`          | The part associated with the damage                                                                                                                                    | ✔        |               |
| `damages.id`              | `string`          | The ID of the damage                                                                                                                                                   |          |               |
| `damages.pricing`         | `number`          | The cost of repair of the damage                                                                                                                                       |          |               |
| `damages.severity`        | `Severity`        | The severity of the damage                                                                                                                                             |          |               |
| `damages.repairOperation` | `RepairOperation` | The type of operation needed to repair the damage                                                                                                                      |          |               |

## Hooks
### useCarOrientation
#### Description
```javascript
import { useCarOrientation } from '@monkvision/inspection-report';
```

This hook provides an easy API to handle the orientation of the wireframes for the `CarView360` component.

#### Arguments
| Prop                    | Type             | Description             | Required | Default Value                |
|-------------------------|------------------|-------------------------|----------|------------------------------|
| `initialOrientation`    | `CarOrientation` | The initial orientation |          | `CarOrientation.FRONT_LEFT`  |

#### Return Object
| Prop             | Type             | Description                                                    |
|------------------|------------------|----------------------------------------------------------------|
| `orientation`    | `CarOrientation` | The current orientation of the wireframe                       |
| `setOrientation` | `function`       | Function used to manually set the orientation of the wireframe |
| `rotateLeft`     | `function`       | Function used to rotate the orientation to the left            |
| `rotateRight`    | `function`       | Function used to rotate the orientation to the right           |

## Types
### DamageMode
```javascript
import { DamageMode } from '@monkvision/inspection-report';
```

Specifies how the damages are displayed on the wireframes.

| DamageMode | Value      | Description                                             |
|------------|------------|---------------------------------------------------------|
| SEVERITY   | `severity` | Only display the severity of the damage                 |
| PRICING    | `pricing`  | Only display the pricing of the damage                  |
| ALL        | `all`      | Display both the severity and the pricing of the damage |

### Severity
```javascript
import { Severity } from '@monkvision/inspection-report';
```

Specifies the severity of a damage.

| Severity | Value    | Description     |
|----------|----------|-----------------|
| LOW      | `low`    | Low severity    |
| MEDIUM   | `medium` | Medium severity |
| HIGH     | `high`   | High severity   |

### CarOrientation
```javascript
import { CarOrientation } from '@monkvision/inspection-report';
```

Specifies the current orentation of a car wireframe.

| Severity    | Value | Description |
|-------------|-------|-------------|
| FRONT_LEFT  | `0`   | Front left  |
| REAR_LEFT   | `1`   | Rear left   |
| REAR_RIGHT  | `2`   | Rear right  |
| FRONT_RIGHT | `3`   | Front right |

### VehicleType
```javascript
import { VehicleType } from '@monkvision/inspection-report';
```

Specifies the type of vehicle displayed in the wireframes of the report.

| VehicleType | Value       | Description            |
|-------------|-------------|------------------------|
| SUV         | `suv`       | SUV vehicle type       |
 | CUV         | `cuv`       | CUV vehicle type       |
 | SEDAN       | `sedan`     | Sedan vehicle type     |
 | HATCHBACK   | `hatchback` | Hatchback vehicle type |
 | VAN         | `van`       | Van vehicle type       |
 | MINIVAN     | `minivan`   | Minivan vehicle type   |
 | PICKUP      | `pickup`    | Pickup vehicle type    |

### RepairOperation
```javascript
import { RepairOperation } from '@monkvision/inspection-report';
```

Specifies the type of operation needed to repair a damage.

| RepairOperation | Value     | Description                     |
|-----------------|-----------|---------------------------------|
| REPAIR          | `repair`  | The damage needs to be repaired |
| REPLACE         | `replace` | The part needs to be replaced   |

## Constants
### CarParts
```javascript
import { CarParts } from '@monkvision/inspection-report';
```

This constant is an array of string containing all the car parts names that are recognized and accepted by this package.

### carPartLabels
```javascript
import { carPartLabels } from '@monkvision/inspection-report';
```

This constant is an object, mapping language keys to dictionaries that associate each car part to its label. It looks
like something like this :

```javascript
const carPartLabels = {
  en: {
    bumper_back: 'Rear Bumper',
    bumper_front: 'Front Bumper',
    ...
  },
  fr: {
    bumper_back: 'Pare-chocs arrière',
    bumper_front: 'Pare-chocs avant',
    ...
  },
  ...
};
```

The currently available languages are :
- English : `en`
- French : `fr`
