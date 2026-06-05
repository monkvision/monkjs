# @monkvision/inspection-review

This package provides a React component to review images from a completed inspection. It allows users to interact with
inspection data, including viewing images grouped by parts, managing damages, and customizing pricing details.
The component is highly customizable to fit various use cases.

## Installing

To install the package, run the following command:

```shell
yarn add @monkvision/inspection-review
```

## Usage

### Basic Example

```tsx
import { InspectionReviewHOC, useInspectionReviewState, TabKeys } from '@monkvision/inspection-review';

function DocumentsView() {
  const { allGalleryItems, setCurrentGalleryItems } = useInspectionReviewState();
  return (
    <Button onClick={() => setCurrentGalleryItems(allGalleryItems.slice(1, 3))}>
      Update gallery
    </Button>
  );
}

function OthersView() {
  const { allGalleryItems, setCurrentGalleryItems } = useInspectionReviewState();
  return (
    <Button onClick={() => setCurrentGalleryItems(allGalleryItems.slice(0, 2))}>
      Update from Other
    </Button>
  );
}

function App() {
  const { inspectionId, apiConfig } = useMonkAppState();

  return (
    <InspectionReviewHOC
      inspectionId={inspectionId}
      apiConfig={apiConfig}
      steeringWheelPosition={SteeringWheelPosition.LEFT}
      vehicleType={VehicleType.SEDAN}
      sightsPerTab={{
        [TabKeys.Exterior]: [
          'haccord-8YjMcu0D',
          'haccord-Z84erkMb',
          'haccord-boMeNVsC',

          'haccord-EfRIciFr',
          'haccord-PGr3RzzP',
          'haccord-sorgeRJ7',
          'haccord-9fxMGSs6',

          'haccord-Jq65fyD4',
          'haccord-6kYUBv_e',

          'haccord-GdWvsqrm',
          'haccord-H_eRrLBl',

          'haccord-Qel0qUky',
          'haccord-_YnTubBA',
          'haccord-oiY_yPTR',
          'haccord-2a8VfA8m',
          'haccord-hsCc_Nct',
          'haccord-2v-2_QD5',
        ],
        [TabKeys.Interior]: [
          'all-qhKA2z',
          'all-e7663823',
          'all-mdwq0pl4',
          'all-11w-_e9c',

          'all-9cw4tn4s',
          'all-1pqg1sU3',
          'all-HWSQ9Svy',
          'all-Pj-K822I',
        ],
      }}
      additionalInfo={{
        'VIN': '1HGBH41JXMN109186',
        'License Plate': 'CUSTOM-PLATE',
        'Customer ID': '2026',
      }}
      customTabs={{
        Documents: {
          Component: DocumentsView,
          onActivate: ({ setCurrentGalleryItems, allGalleryItems }) => {
            setCurrentGalleryItems(allGalleryItems.slice(0, 2));
          },
        },
        Others: OthersView,
      }}
    />
  );
}
```

## Props

### InspectionReviewHOC

| Prop                    | Type                                       | Description                                            | Required                                                        | Default Value |
| ----------------------- | ------------------------------------------ | ------------------------------------------------------ | --------------------------------------------------------------- | ------------- | ------ |
| `inspectionId`          | `string`                                   | The ID of the inspection to review.                    | ✔️                                                              |               |
| `apiConfig`             | `MonkApiConfig`                            | API configuration for communication.                   | ✔️                                                              |               |
| `steeringWheelPosition` | `SteeringWheelPosition`                    | Position of the steering wheel in the vehicle.         | ✔️                                                              |               |
| `vehicleType`           | `VehicleType`                              | The type of vehicle involved in the inspection.        | ✔️                                                              |               |
| `sightsPerTab`          | `Record<TabKeys                            | string, string[]>`                                     | Mapping of sight images available in the Gallery for each Tab.  | ✔️            |        |
| `lang`                  | `string                                    | null`                                                  | Language for the component.                                     |               | `'en'` |
| `additionalInfo`        | `Record<string, string                     | number>`                                               | Additional information to display (e.g., license plate, owner). |               |        |
| `isPDFGeneratorEnabled` | `boolean`                                  | Enable or disable PDF generation.                      |                                                                 | `true`        |
| `customTabs`            | `Record<string, TabContent>`               | Custom tabs to display along with default ones.        |                                                                 |               |
| `currency`              | `string`                                   | Currency for cost estimates.                           |                                                                 | `'$'`         |
| `pricings`              | `Record<string, PricingData>`              | Custom pricing details for the pricing legend section. |                                                                 |               |
| `onDownloadPDF`         | `() => void`                               | Callback triggered when PDF generation is requested.   |                                                                 |               |
| `onDownloadImages`      | `(allGalleryItems: GalleryItem[]) => void` | Callback triggered when images are downloaded.         |                                                                 |               |

## Components

### InspectionInfo

- **Purpose**: Displays additional information about the inspection.
- **Props**:

| Prop             | Type                     | Description                    | Required | Default Value |
| ---------------- | ------------------------ | ------------------------------ | -------- | ------------- |
| `additionalInfo` | `Record<string, string>` | Additional inspection details. |          |               |

### Tabs

- **Purpose**: Manages and displays tabs for navigation.
- **Props**:

| Prop          | Type       | Description                     | Required | Default Value |
| ------------- | ---------- | ------------------------------- | -------- | ------------- |
| `allTabs`     | `string[]` | List of all available tabs.     | ✔️       |               |
| `activeTab`   | `string`   | Currently active tab.           | ✔️       |               |
| `onTabChange` | `function` | Callback for tab change events. | ✔️       |               |

### DownloadImagesButton

- **Purpose**: Provides a button to download images from the inspection review.
- **Props**:

| Prop               | Type       | Description                         | Required | Default Value |
| ------------------ | ---------- | ----------------------------------- | -------- | ------------- |
| `onDownloadImages` | `function` | Callback triggered on button click. | ✔️       |               |

### GeneratePDFButton

- **Purpose**: Allows users to generate a PDF report of the inspection.
- **Props**:

| Prop            | Type       | Description                         | Required | Default Value |
| --------------- | ---------- | ----------------------------------- | -------- | ------------- |
| `onDownloadPDF` | `function` | Callback triggered on button click. | ✔️       |               |

### ReviewGallery

- **Purpose**: Displays a gallery of images for review.
- **Props**:

| Prop                  | Type    | Description                       | Required | Default Value |
| --------------------- | ------- | --------------------------------- | -------- | ------------- |
| `currentGalleryItems` | `Array` | List of gallery items to display. | ✔️       |               |

### InteriorTab and ExteriorTab

- **Purpose**: These are specific tabs within the `Tabs` component for interior and exterior views.
- **Props**: Managed by the `Tabs` component.
