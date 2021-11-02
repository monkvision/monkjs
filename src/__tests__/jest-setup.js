/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies */

import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line global-require
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported
// because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

// eslint-disable-next-line no-console
const error = console.error;

// eslint-disable-next-line no-console
console.error = (...args) =>
  // Suppress error messages regarding error boundary in tests
  // (Consider adding an error boundary to your tree to customize error handling behavior
  // | React will try to recreate this component tree from scratch
  // using the error boundary you provided
  // | Error boundaries should implement getDerivedStateFromError)
  // eslint-disable-next-line implicit-arrow-linebreak,no-undef
  (m.test(
    args[0],
  )
    // eslint-disable-next-line no-void
    ? void 0
    : error(...args));
