# Hooks
This README page is aimed at providing documentation on a specific part of the `@monkvision/common` package : the
React hooks. You can refer to [this page](README.md). for more general information on the package.

This package exports various custom hooks used throughout the MonkJs SDK.

### useWindowDimensions
```tsx
import { useWindowDimensions } from '@monkvision/common';

function TestComponent() {
  const { width, height, isPortrait } = useWindowDimensions();
}
```
This hook returns the current window dimensions in pixels, and a boolean indicating if the window is in portrait mode
(width < height) or not.

### useResponsiveStyle
```tsx
import { useResponsiveStyle } from '@monkvision/common';
import { Styles } from '@monkvision/types';

const styles: Styles = {
  div: {
    width: 100,
    height: 100,
  },
  divMobile: {
    __media: { maxWidth: 500 },
    backgroundColor: '#ff0000',
  },
};

function TestComponent() {
  const { responsive } = useResponsiveStyle();
  return <div style={{...styles.div, ...responsive(styles.divMobile)}}>Hello</div>
}
```
This hook returns takes a `ResponsiveStyleProperties` declarations object (see the definition of this type in the
`@monkvision/types` package for more details) containing a media query and returns either the CSSProperties contained in
the type, or `null` if the query conditions are not met. Note that if there are no query, the style will be applied.

### useInteractiveStatus
```tsx
import { useInteractiveStatus } from '@monkvision/common';

function TestComponent() {
  const { status, events } = useInteractiveStatus();
  useEffect(() => console.log('Button status :', status), [status]);

  return <button {...events}>My Button</button>;
}
```
This hook allows the tracking of the interactive status (hovered, active, disabled...) of a React element. It returns
the interactive status of the element, as well as a set of MouseEvent listeners used to update the status accordingly.

### useQueue
```tsx
import { useQueue } from '@monkvision/common';

function TestComponent() {
  const queue = useQueue<string>((item) => {
    console.log(item);
    return Promise.resolve();
  });
  ...
}
```

This hook is used to create a processing queue. The `process` function passed as a parameter is an async function
that is used to process items in the queue. You can find more details on how the queue works by taking a look at the
TSDoc of the `Queue` interface.
