# Utilities
This README page is aimed at providing documentation on a specific part of the `@monkvision/common` package : the
utility functions. You can refer to [this page](README.md). for more general information on the package.

This package exports various utility functions used throughout the MonkJs SDK.

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

# Array Utils
### permutations
```typescript
import { permutations } from '@monkvision/common';

console.log(permutations([1, 2, 3]));
// Output : [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
```
Returns an array containing all the possible permutations of the given array.

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
