# Utilities
This README page is aimed at providing documentation on a specific part of the `@monkvision/common` package : the
utility functions. You can refer to [this page](README.md) for more general information on the package.

This package exports various utility functions used throughout the MonkJs SDK.

# Array Utils
### permutations
```typescript
import { permutations } from '@monkvision/common';

console.log(permutations([1, 2, 3]));
// Output : [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
```
Returns an array containing all the possible permutations of the given array.

### uniq
```typescript
import { uniq } from '@monkvision/common';

console.log(uniq([1, 1, 1, 2, 3, 3]));
// Output : [1, 2, 3]
```
Return a copy of the given array in which all duplicates have been removed.

### flatten
```typescript
import { flatten } from '@monkvision/common';

console.log(flatten([ 1, [2, 3], [[4], [5, 6]]]));
// Output : [1, 2, 3, 4, 5, 6]
```
Flatten the given array.

### flatten
```typescript
import { flatMap } from '@monkvision/common';

console.log(flatMap([1, 2, 3], (item: number) => [item, item + 1]));
// Output : [1, 2, 2, 3, 3, 4]
```
JS implementation of the
[Array.prototype.flatMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
method, available on all versions of JavaScript.

---

# Browser Utils
### isMobileDevice

```typescript
import { isMobileDevice } from "@monkvision/common";

console.log(isMobileDevice());
// Output : true or false
```
Checks if the current device is a mobile device.

### getAspectRatio
```typescript
import { getAspectRatio } from "@monkvision/common";

const streamDimensions = {width: 1920, height: 1080}
console.log(getAspectRatio(streamDimensions));
// Output : '1920/1080'
```
Returns the aspect ratio of the stream. If not a mobile device, it will return 16/9 by default.

---

# Color Utils
### getRGBAFromString
```typescript
import { getRGBAFromString } from '@monkvision/common';

console.log(JSON.stringify(getRGBAFromString('#AF270CCC')));
// Output : {"r":175,"g":39,"b":12,"a":0.8}
```
Returns the RGBA values of the given color. The accepted formats are :
- RGB : `rgb(167, 224, 146)`
- RGBA : `rgb(167, 224, 146, 0.03)`
- HEX : `#A7E092`
- HEX (alpha) : `#A7E09208`
- HEX (short) : `#AE9`
- HEX (short + alpha) : `#AE98`

This function is case-insensitive and ignores white spaces.

### getHexFromRGBA
```typescript
import { getHexFromRGBA } from '@monkvision/common';

console.log(getHexFromRGBA({ r: 111, g: 222, b: 0, a: 0.67 }));
// Output : #6FDE00AB
```
Converts RGBA values to their hexadecimal representation.

### shadeColor
```typescript
import { shadeColor } from '@monkvision/common';

console.log(shadeColor('#FC72A7', 0.7));
// Output : #FFC2FFFF
```
Apply a shade of black or white over the given color. The amount of shade to apply works as a ratio :
- use positive values like 0.08 to lighten the color by 8%
- use negative values like -0.08 to darken the color by 8%

### changeAlpha
```typescript
import { changeAlpha } from '@monkvision/common';

console.log(changeAlpha('#FF1234FF', 0.5));
// Output : #FF123480
```
Returns a new color equal to the given color but with a different alpha value.

### getInteractiveVariants
```typescript
import { getInteractiveVariants } from '@monkvision/common';

const variants = getInteractiveVariants('#FC72A7');
/*
 * variants = {
 *   [InteractiveStatus.DEFAULT]: '#FC72A7',
 *   [InteractiveStatus.HOVERED]: '#FF7BB4',
 *   [InteractiveStatus.ACTIVE]: '#FF80BB',
 *   [InteractiveStatus.DISABLED]: '#FC72A7',
 * }
 */
```
Create interactive variants (hovered, active...) for the given color. You can specify as an additional parameter the
type of variation to use for the interactive colors (lighten or darken the color, default = lighten).

### fullyColorSVG
```tsx
import { useCallback } from 'react';
import { fullyColorSVG } from '@monkvision/common';
import { DynamicSVG } from '@monkvision/common-ui-web';

function TestComponent() {
  const getAttributes = useCallback((element: Element) => fullyColorSVG(element, '#FFFFFF'), []);
  return (
    <DynamicSVG svg={logoSVG} getAttributes={getAttributes} />
  );
}
```
This utility function can be passed to the `DynamicSVG` component's `getAttributes` prop to completely color an SVG
with the given color. This is useful when wanting to color a single-color icon or logo.

---

# Config Utils
### getAvailableVehicleTypes
```typescript
import { getAvailableVehicleTypes } from '@monkvision/common';

console.log(getAvailableVehicleTypes(config));
// Output : [VehicleType.CITY, VehicleType.SUV]
```
Returns the list of available vehicle types based on the `sights` property of a `PhotoCaptureAppConfig` object.

# Environment Utils
### getEnvOrThrow
```typescript
import { getEnvOrThrow } from '@monkvision/common';

try {
  const example = getEnvOrThrow('REACT_APP_EXAMPLE');
  console.log('Env var is defined :', example);
} catch (err) {
  console.log('Env var is not defined');
}
```
Returns the value of a given environment variable. If the value does not exist, it throws an error.

---

# Form Validation Utils
### mergeValidationFunctions
```typescript
import { mergeValidationFunctions } from '@monkvision/common';

const merged = mergeValidationFunctions(
  (value: any) => typeof value === 'string' && value.length > 3 ? null : 'too-short',
  (value: any) => typeof value === 'string' && value.length < 3 ? null : 'too-long',
);
console.log(merged('ab')); // Output : 'too-short'
console.log(merged('abcd')); // Output : 'too-long'
console.log(merged(123)); // Output : 'too-short'
console.log(merged('abc')); // Output : null
```
Util function used to merge multiple validation functions into a single one. The first error discovered will be
returned.

### required
```typescript
import { required } from '@monkvision/common';

console.log(required('')); // Output : 'required'
console.log(required(null)); // Output : 'required'
console.log(required(12)); // Output : null
console.log(merged('abc')); // Output : null
console.log(merged(false)); // Output : null
```
Validation function for required fields.

### email
```typescript
import { email } from '@monkvision/common';

console.log(email('')); // Output : 'required'
console.log(email('abc')); // Output : 'emailNotValid'
console.log(email(123)); // Output : 'emailNotValid'
console.log(email('test@acvauctions.com')); // Output : null'
```
Validation function for valid email fields.

---

# Mimetype Utils
### MIMETYPE_FILE_EXTENSIONS
```typescript
import { MIMETYPE_FILE_EXTENSIONS } from '@monkvision/common';

console.log(MIMETYPE_FILE_EXTENSIONS['text/plain']);
// Output : ['txt']
```
Datamap that associates mimetypes to known file extensions corresponding to this mimetype.

### getFileExtensions
```typescript
import { getFileExtensions } from '@monkvision/common';

console.log(getFileExtensions('image/jpeg'));
// Output : ['jpeg', 'jpg']
```
Returns a list of file extensions known to be corresponding to the given mimetype. If no file extension is known for
this mimetype, this function will throw an error.

### getMimetype
```typescript
import { getMimetype } from '@monkvision/common';

console.log(getMimetype('jpg'));
// Output : 'image/jpeg'
```
Returns the mimetype associated with the given file extension. If the file extension is unknown, this function will
throw an error.

---

# Promise Utils
### timeoutPromise
```typescript
import { timeoutPromise } from '@monkvision/common';

timeoutPromise(5000).then(() => console.log('Hello!'));
// Output after 5 seconds : 'Hello!'
```
This function creates and returns a new Promise that will resolve to void after the given amount of milliseconds.

---

# State Utils
### getInspectionImages
```typescript
import { getInspectionImages } from '@monkvision/common';

console.log(getInspectionImages(inspectionId, images, filterRetakes));
// Returns an array of all the images having the given inspectionId.
```
Utility function that extracts the images of the given inspection. Set `filterRetakes` to `false` to filter retaken
pictures.

---

# String Utils
### suffix
```typescript
import { suffix } from '@monkvision/common';

console.log(suffix('my-str', { suffix1: true, suffix2: false }));
// Output : 'my-str suffix1'
```
This function suffixes a string with the given suffixes, only if their value is `true` in the suffixes object param.

*Note : The order of the suffixes is not guaranteed.*

### words
```typescript
import { words } from '@monkvision/common';

console.log(words('my-str-test'));
// Output : 'my str test'
```
Split the given string into its composing words.

### capitalize
```typescript
import { capitalize } from '@monkvision/common';

console.log(capitalize('my-str-test'));
// Output : 'My-str-test'
```
Capitalizes (transforms the first character to upper case) the given string.

### uncapitalize
```typescript
import { uncapitalize } from '@monkvision/common';

console.log(uncapitalize('My-str-test'));
// Output : 'my-str-test'
```
Uncapitalizes (transforms the first character to lower case) the given string.

### toCamelCase
```typescript
import { toCamelCase } from '@monkvision/common';

console.log(toCamelCase('My-str-test'));
// Output : 'myStrTest'
```
Converts a string to camel case.

---

# Vehicle
### getVehicleModel
```typescript
import { getVehicleModel } from '@monkvision/common'
import { VehicleType } from '@monkvision/types'

console.log(getVehicleModel(VehicleType.SUV))
output : 'fesc20'
```
Returns the vehicle model corresponding to the given vehicle type.

---

# Zlib Utils
### zlibCompress
```typescript
import { zlibCompress } from '@monkvision/common';

console.log(zlibCompress('Hello World!'))
// Output : 'eJzzSM3JyVcIzy/KSVEEABxJBD4='
```
Compresses and encodes a string in base64 using the ZLib algorithm.

### zlibDecompress
```typescript
import { zlibDecompress } from '@monkvision/common';

console.log(zlibDecompress('eJzzSM3JyVcIzy/KSVEEABxJBD4='))
// Output : 'Hello World!'
```
Decompresses a string that has been encoded in base64 and compressed using the Zlib algorithm.
