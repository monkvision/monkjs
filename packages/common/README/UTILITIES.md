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
## permutations
```typescript
import { permutations } from '@monkvision/common';

console.log(permutations([1, 2, 3]));
// Output : [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
```
Returns an array containing all the possible permutations of the given array.

# Queue Utils
## useQueue
```typescript
import { useQueue } from '@monkvision/common';

function TestComponent() {
  const queue = useQueue<string>((item) => console.log(item));
  ...
}
```

This hook is used to create a processing queue. The `process` function passed as a parameter is an async function
that is used to process items in the queue. You can find more details on how the queue works by taking a look at the
TSDoc of the `Queue` interface.
