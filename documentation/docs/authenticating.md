---
sidebar_position: 4
---

# Authenticating
In order to use the MonkJs, you will need to provide an authentication token to make API requests. This means that the
first step before accessing the Capture or InspectionReport components will be to generate a token. This documentation
page describes the two main ways Monk authentication tokens are generated.

## Authenticating Through URL
Most of our clients usually access the Monk webapp via redirection or QR Code flashing and want to immediately let the
user start using the application. To do this in your app, you can generate an authentication token in advance (using
Auth0 M2M credentials provided by Monk) and pass this token as a URL search parameter.

### Generating The Token
In order to generate the token, you can use the M2M authentication credentials provided by Monk and implement the Auth0
sign-in logic. Once the token has been generated, you will need to compress it using the [zlib](https://www.zlib.net/)
compression algorithm, then encode it in URL format. The zlib algorithm is implemented and available in many different
languages and frameworks. In MonkJs, we provide utilities to do this in JavaScript :

```typescript
import { zlibCompress } from '@monkvision/common';

const myToken = 'my-auth0-authentication-token';
// First, compress the token using zlib
const compressedToken = zlibCompress(myToken);
// Then, encode it in URL format
const tokenSearchParameter = encodeURIComponent(compressedToken);
```

### Fetching The Token From URL
Once the token has been generated, you can pass it to your app via URL search params. You will then need to decompress
it using zlib again. The MonkJs SDK still offers utilities to do this :

```tsx
import { useSearchParams } from 'react-router-dom';
import { zlibDecompress } from '@monkvision/common';

function HomePage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const compressedToken = searchParams.get('t');
    if (compressedToken) {
      console.log('authToken :', zlibDecompress(compressedToken));
    }
  }, [searchParams]);

  return <div>Hello World!</div>;
}
```

You can skip implementing all this logic by simply using the `MonkAppStateProvider` component that will handle the
fetching from the search param and the decompression for you. More details on this in the
[next section](/docs/application-state.md).

## Manual Login
If you want to allow your users to manually log in using their own credentials, you can install the `@auth0/auth0-react`
package and follow [their official documentation](https://auth0.com/docs/libraries/auth0-react) to generate an
authentication token after the user has logged in.

You can also use our single page `Login` component (available in the `@monkvision/common-ui-web` package) that
implements a ready-to-use login page :

```tsx
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Login } from '@monkvision/common-ui-web';

export function LoginPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <Login
      lang={i18n.language}
      onLoginSuccessful={() => navigate('/next-page')}
    />
  );
}
```
