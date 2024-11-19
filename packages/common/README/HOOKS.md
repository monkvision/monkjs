# Hooks
This README page is aimed at providing documentation on a specific part of the `@monkvision/common` package : the
React hooks. You can refer to [this page](README.md) for more general information on the package.

This package exports various custom hooks used throughout the MonkJs SDK.

### useAsyncEffect
```tsx
import { useAsyncEffect } from '@monkvision/common';

function TestComponent() {
  useAsyncEffect(
    async () => {
      const result = myCustomAsyncFunc();
      return result.value;
    },
    [exampleDependency],
    {
      onResolve: (value) => {
        console.log(value);
      },
      onReject: (err) => {
        console.error(err);
      },
      onComplete: () => {
        console.log('Done.');
      }
    },
  );
}
```
Custom hook that can be used to run asyncrhonous effects. It is similar to `useEffect` but makes sure to not execute the
effect handlers if the effect's Promise resolves after the current component as been dismounted.

### useAsyncInterval
```tsx
import { useAsyncInterval } from '@monkvision/common';

function TestComponent() {
  useAsyncInterval(
    myCustomAsyncCallback,
    1000,
    {
      onResolve: (value) => {
        console.log(value);
      },
      onReject: (err) => {
        console.error(err);
      },
      onComplete: () => {
        console.log('Done.');
      }
    },
  );
}
```
This custom hook creates an interval that calls the provided async callback every `delay` milliseconds if the previous
call isn't still running. If `delay` is `null` or less than 0, the callback will not be called. The promise handlers
provided will only be called while the component is still mounted.

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

### useInterval
```tsx
import { useInterval } from '@monkvision/common';

function TestComponent() {
  useInterval(() => console.log('Hello World!'), 1000);
}
```
This custom hook creates an interval that calls the provided callback every `delay` milliseconds. If `delay` is `null`
or less than 0, the callback will not be called.

### useIsMounted
```tsx
import { useIsMounted } from '@monkvision/common';

function TestComponent() {
  const [example, setExample] = useState(0);
  const isMounted = useIsMounted();

  useEffect(() => {
    myAsyncFunc().then((value) => {
      if (isMounted()) {
        setExample(value);
      }
    }).catch(console.error);
  }, [isMounted]);
}
```
Custom hook returning a ref to a util function returning `true` if the component using the hook is mounted, and false
otherwise. Can be used to cancel asynchronous calls on component unmounts.

### useForm

```tsx
import { useTranslation } from 'react-i18next';
import { useForm, required, email } from '@monkvision/common';
import { Button, TextField } from '@monkvision/common-ui-web';

function TestComponent() {
  const { t } = useTranslation();
  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email,
    },
  });

  return (
    <form onSubmit={() => console.log('Submit')}>
      <label htmlFor='email'>Email</label>
      <TextField
        id='email'
        focusColor={form.isInputErrorDisplayed('email') ? 'alert-base' : 'primary-base'}
        assistiveText={
          form.isInputErrorDisplayed('email')
            ? t(`form.errors.${form.getInputError('email')}`)
            : undefined
        }
        highlighted={form.isInputErrorDisplayed('email')}
        {...form.getInputProps('email')}
      />
      <Button type='submit'>Confirm</Button>
    </form>
  );
}
```
Custom hook used to manage forms in ReactJs.

### useLangProp
```tsx
import { useLangProp } from '@monkvision/common';

function TestComponent(props: { lang?: string }) {
  useLangProp(lang);
}
```
Custom hook used internally by the Monk SDK components to handle the `lang` prop tha tcan be passed to them to manage
the current language displayed by the component.

### useLoadingState
```tsx
import { useEffect } from 'react';
import { useLoadingState } from '@monkvision/common';

function useCustomApiCall() {
  const loading = useLoadingState();
  useEffect(() => {
    loading.start();
    myApiCall().then(() => loading.onSuccess()).catch((err) => loading.onError(err));
  }, []);
}
```
Custom hook used to create a `LoadingState` object. This object can be used to track the processing of a task in the
component. For instance, you can use this hook to handle the loading and errors of API calls in your components.

### useObjectMemo
```tsx
import { useMemo } from 'React';
import { useObjectMemo } from '@monkvision/common';

function TestComponent() {
  // These 2 lines are equivalent
  const foo = useMemo(() => ({ bar, baz }), [bar, baz]);
  const foo = useObjectMemo({ bar, baz });
}
```
This custom hook is used to have a more handy way of memoizing a record of values.

### useObjectTranslation
```tsx
import { useObjectTranslation } from '@monkvision/common';

const translationObject = { en: 'Hello', fr: 'Salut', de: 'Hallo' };

function TestComponent() {
  const { tObj } = useObjectTranslation();
  return <div>{tObj(translationObject)}</div>;
}
```
Custom hook used to get a translation function tObj that translates TranslationObjects.

### usePreventExit
```ts
import { usePreventExit } from '@monkvision/common';

function MyComponent() {
  const { allowRedirect } = usePreventExit(true);

  const anyEvent = useCallback(() => {
    allowRedirect();
    /** ... */
  }, [allowRedirect])
}
```

This hook is used to prevent the user from leaving the page by displaying a confirmation dialog when the user tries to
leave the page.

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

### useSearchParams
```tsx
import { sights } from '@monkvision/sights';
import { useSearchParams } from '@monkvision/common';

function TestComponent() {
  const searchParams = useSearchParams();
  console.log(searchParams.get('myParam'));
}
```
Custom hook used to fetch search params from the current window URL.

### useSightLabel
```tsx
import { sights } from '@monkvision/sights';
import { useSightLabel } from '@monkvision/common';

function TestComponent() {
  const { label } = useSightLabel();
  return <div>{label(sights['fesc20-0mJeXBDf'])}</div>;
}
```
Custom hook used to get the label of a sight with the currently selected language.

### useThumbnail
```tsx
import { useThumbnail } from '@monkvision/common';

function TestComponent() {
  const { getThumbnailUrl } = useThumbnail(thumbnailDomain);
  console.log(getThumbnailUrl(image));
}
```
Custom hook used to generates a thumbnail URL from a full resolution picture.

### useWindowDimensions
```tsx
import { useWindowDimensions } from '@monkvision/common';

function TestComponent() {
  const { width, height, isPortrait } = useWindowDimensions();
}
```
This hook returns the current window dimensions in pixels, and a boolean indicating if the window is in portrait mode
(width < height) or not.
