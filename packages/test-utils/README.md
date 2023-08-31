# @monkvision/test-utils
This package exports various test utilities used for automated testing in the MonkJs project. **This package is for
internal use only and is not aimed to be used outside Monk SDK development**.

# Installation
To install the package, you can run the following command :

```shell
yarn add -D @monkvision/test-utils
```

# Usage
This package is developed to be used with TypeScript Jest. This means that this package directly exports TypeScript
code : no compilation is required, and you can simply import the utils you need using the following syntax :

```typescript
import { ... } from '@monkvision/test-utils';
```

# Available Utils
This package exports the following test utilities :
- Useful `expect` test assertions (declared in the `src/expects` directory).
