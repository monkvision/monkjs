# Utilities
This README page is aimed at providing documentation on a specific part of the `@monkvision/common` package : the
utility functions. You can refer to [this page](README.md). for more general information on the package.

This package exports various utility functions used throughout the MonkJs SDK.

# String Utils
## suffix
```typescript
import { suffix } from '@monkvision/common';

console.log(suffix('my-str', { suffix1: true, suffix2: false }));
// Output : 'my-str suffix1'
```

This function suffixes a string with the given suffixes, only if their value is `true` in the suffixes object param.

Note : The order of the suffixes is not guaranteed.

| Param     | Type                                                   | Description                                         | Required | Default Value |
|-----------|--------------------------------------------------------|-----------------------------------------------------|----------|---------------|
| str       | `string`                                               | The string to suffix.                               | ✔️       |               |
| suffixes  | `Record<string, boolean &#124; undefined &#124; null>` | The suffixes to add (onl;y if their value is true). | ️        |               |
| separator | `string`                                               | The separator string to put between each suffix.    | ️        | `' '`         |

# Array Utils
## permutations
```typescript
import { permutations } from '@monkvision/common';

console.log(permutations([1, 2, 3]));
// Output : [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
```

Returns an array containing all the possible permutations of the given array.

| Param     | Type                                                   | Description                                         | Required | Default Value |
|-----------|--------------------------------------------------------|-----------------------------------------------------|----------|---------------|
| array     | array                                                  | The array to compute the permutations of.           | ✔️       |               |
