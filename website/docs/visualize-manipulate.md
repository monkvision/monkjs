---
id: visualize-manipulate
title: "🧿 Visualize & Manipulate"
slug: /visualize-manipulate
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/camera/latest.svg)

## Modules overview

The Visualize & Manipulate module allows users to visualize the results of an inspection as well as edit these results. This includes things such as visualizing the location, severity, and/or repair cost of damages on the car, as well as adding, editing, or removing damages in the report.

## Implementation Guide
To use `V&M` feature in an application.

```yarn
yarn add @monkvision/inspection-report
```

``` javascript
import { DamageMode, DamageReport } from '@monkvision/inspection-report';
```

## Basic usage

Here is an example of how we can show damage report of an inspection.

```javascript
import React, { useMemo } from 'react';
import { DamageMode, DamageReport } from '@monkvision/inspection-report';
import { useRoute } from '@react-navigation/native';

const damageMode = DamageMode.ALL;

export default function InspectionReport() {
  const route = useRoute();
  const { inspectionId, vehicleType } = route.params;
  const pdfOptions = useMemo(() => ({
    customer: 'PDF_REPORT_CUSTOMER',
    clientName: 'PDF_REPORT_CLIENT_NAME',
  }), []);

  return (
    <DamageReport
      inspectionId={inspectionId}
      damageMode={damageMode}
      vehicleType={vehicleType}
      generatePdf
      pdfOptions={pdfOptions}
      onStartNewInspection={() => {
        // navigate to landing page
      }
    />
  );
}
```

<hr />

# Overview

The **_Damage report_** component renders two tabs: _"Overview"_ and _"Photos"_. The "Overview" tab renders damages and the "Photos" tab renders a gallery of photos taken during the inspection.

The component uses a variety of hooks which makes the component more robust.
* The component uses the `useFetchInspection` hook to fetch the inspection data from the server.
* The component uses the `useDamageReportStateHandlers` hook to manage the state of the damage report.
* The component uses the `usePdfReport` hook to generate a PDF of the damage report.

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

**_Replace_** will allow to define whether the damage is replaced or repaired. If it's true, then it will disable pricing bar and set **_Severity_** level to `Major` that means the part needs to be replaced.

#### `damageMode='pricing'`
It will show pricing bar to set the estimated cost of repairing the damage from _$1_ to _$1500_.

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
