---
id: visualize-manipulate
title: "🧿 Visualize & Manipulate"
slug: /visualize-manipulate
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/camera/latest.svg)

```yarn
yarn add @monkvision/inspection-report
```

``` javascript
import { DamageMode } from '@monkvision/inspection-report';
```

# Basic usage

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
    />
  );
}
```

# Props

The Damage report component is based on these principal states `inspectionId`, `damageMode`, `vehicleType`, `generatePdf` and `pdfOptions`.

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

List of possible types of damages for damage report of inspection. Based on this value we are disabling the other fields on the screen.

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
