---
id: visualize-manipulate
title: "🧿 Visualize & Manipulate"
slug: /visualize-manipulate
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/camera/latest.svg)

## Modules overview

The Visualize & Manipulate module allows users to visualize the results of an inspection as well as edit these results. This includes things such as visualizing the location, severity, and/or repair cost of damages on the car, as well as adding, editing, or removing damages in the report.

## Implementation Guild
To use `V&M` feature in an application, needs to install a following package

```yarn
yarn add @monkvision/inspection-report
```

Needs to use following APIs
``` javascript
import { DamageMode, DamageReport } from '@monkvision/inspection-report';
```

## Basic usage

Here is an example of how we can show damage report of an inspection.

```javascript
import React, { useMemo } from 'react';
import { DamageMode, DamageReport } from '@monkvision/inspection-report';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as names from 'screens/names';

const damageMode = DamageMode.ALL;

export default function InspectionReport() {
  const route = useRoute();
  const { inspectionId, vehicleType } = route.params;
  const pdfOptions = useMemo(() => ({
    customer: 'PDF_REPORT_CUSTOMER',
    clientName: 'PDF_REPORT_CLIENT_NAME',
  }), []);
  const navigation = useNavigation();

  return (
    <DamageReport
      inspectionId={inspectionId}
      damageMode={damageMode}
      vehicleType={vehicleType}
      generatePdf
      pdfOptions={pdfOptions}
      onStartNewInspection={() => navigation.navigate(names.LANDING)}
    />
  );
}
```

<hr />

# Props

The **_Damage report_** component is based on these principal states `inspectionId`, `damageMode`, `vehicleType`, `generatePdf`, `pdfOptions` and `onStartNewInspection`.

## inspectionId
`PropTypes.string`

ID of an inspection for which we are visualizing the damage.

## damageMode
```javascript
PropTypes.oneOf([
  'severity',
  'pricing',
  'all',
])
```

List of possible types of damages for damage report of inspection. Based on this value we are showing the other fields on the screen.

#### `damageMode='severity'`
It will show fields to define **_Severity_** levels and **_Replace_** a part.

**_Severity_** levels will allow to define damage severity as one of values from `Minor / Moderate / Major`.

**_Replace_** will allow to define whether the part needs to be replaced completely. If it's true, then it will disable pricing bar and set **_Severity_** level to `Major`.

#### `damageMode='pricing'`
It will show pricing bar to set price value from _$1_ to _$1500_ for damaged part.

#### `damageMode='all'`
It will show all fields.

## vehicleType
```javascript
PropTypes.oneOf([
  'suv',
  'cuv',
  'sedan',
  'hatchback',
  'van',
  'minivan',
  'pickup',
])
```

List of possible types of vehicles for capture tour inspection.

## generatePdf
`PropTypes.bool`

Based on the generatePdf value, download button will be visible on the screen.

## pdfOptions
```javascript
PropTypes.shape({
  clientName: PropTypes.string.isRequired,
  customer: PropTypes.string.isRequired,
})
```

Client and customer names are required for requesting inspection report pdf.

## onStartNewInspection
`PropTypes.func`

Handler to let the user start a new damage inspection.
