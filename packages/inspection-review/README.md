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
import { InspectionReview } from '@monkvision/inspection-review';

function App() {
  const { config, authToken, inspectionId } = useMonkAppState();

  return (
      <InspectionReviewHOC
        inspectionId={inspectionId}
        apiConfig={apiConfig}
        steeringWheelPosition={SteeringWheelPosition.LEFT}
        unmatchedSightsTab={TabKeys.EXTERIOR}
        vehicleTypes={[VehicleType.SUV]}
        sights={{
           [VehicleType.SUV]: [
            'jgc21-QIvfeg0X',
            'jgc21-KyUUVU2P',
         ],
        }}
      />
  );
}
```

## Props

| Prop                    | Type                                     | Description                                                     | Required | Default Value |
| ----------------------- | ---------------------------------------- | --------------------------------------------------------------- | -------- | ------------- |
| `inspectionId`          | `string`                                 | The ID of the inspection to review.                             | ✔️       |               |
| `apiConfig`             | `MonkApiConfig`                          | API configuration for communication.                            | ✔️       |               |
| `steeringWheelPosition` | `SteeringWheelPosition`                  | Position of the steering wheel in the vehicle.                  | ✔️       |               |
| `vehicleTypes`          | `VehicleType[]`                          | Types of vehicles involved in the inspection.                   | ✔️       |               |
| `sights`                | `Partial<Record<VehicleType, string[]>>` | Mapping of vehicle types to their corresponding sight IDs.      | ✔️       |               |
| `unmatchedSightsTab`    | `TabKeys \| string`                      | Tab key for displaying unmatched sights.                        |          |               |
| `lang`                  | `string \| null`                         | Language for the component.                                     |          | `'en'`        |
| `additionalInfo`        | `Record<string, string \| number>`       | Additional information to display (e.g., license plate, owner). |          |
| `isPDFGeneratorEnabled` | `boolean`                                | Enable or disable PDF generation.                               |          | `true`        |
| `customTabs`            | `Record<string, TabContent>`             | Custom tabs to display along with default ones.                 |          |               |
| `currency`              | `string`                                 | Currency for cost estimates.                                    |          | `'USD'`       |
| `pricings`              | `Record<string, PricingData>`            | Custom pricing details for the pricing legend section.          |          |               |
| `onDownloadPDF`         | `() => void`                             | Callback triggered when PDF generation is requested.            |          |               |

## Features

- **Image Review**: View images grouped by parts and sorted by active tabs.
- **Damage Management**: Add or remove damages for each part.
- **Pricing Customization**: Add or remove pricing details for each part.
- **Customizable**: Supports various props for language, tabs, API callbacks, and additional information.
