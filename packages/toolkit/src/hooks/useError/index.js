import { Platform } from 'react-native';

export default function useError({ Sentry }) {
  const Constants = {
    type: {
      UPLOAD: 'upload', // logs linked to the upload
      CAMERA: 'camera', // logs linked to the camera
      FUNC: 'func', // logs linked to a function
      APP: 'app', // logs linked to the application
      HTTP: 'http', // logs linked to the api
    },
  };

  class Span {
    constructor(name, op) {
      const t = Platform.select({ web: Sentry.Browser, native: Sentry.Native })
        .startTransaction({ name });
      this.transaction = t;
      this.span = t.startChild({ op });
    }

    finish() {
      this.span.finish();
      this.transaction.finish();
    }
  }

  /**
   * @param error {Error} - Caught error to send to Sentry.io
   * @param type {string} - tag of the error's type
   * @param extras {Record} - Useful information that can be sent (request's body for example)
   * @param additionalTags - (Optional) Additional tags to add to the error
   */
  const errorHandler = (error, type, extras = {}, additionalTags = {}) => (
    Platform.select({
      native: Sentry.Native,
      web: Sentry.Browser,
    })
      .captureException(error, (scope) => {
        scope.setTags({ type, ...additionalTags });
        scope.setExtras(extras);

        return scope;
      })
  );

  return { errorHandler, Constants, Span };
}
